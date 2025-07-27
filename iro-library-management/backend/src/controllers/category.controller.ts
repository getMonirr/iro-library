import { Response } from "express";
import { validationResult } from "express-validator";
import { AuthenticatedRequest } from "../middleware/auth";
import { catchAsync } from "../middleware/errorHandler";
import Category from "../models/Category";

export const getAllCategories = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const {
      page = 1,
      limit = 50,
      search,
      sortBy = "name",
      sortOrder = "asc",
      isActive,
      includeBooksCount = false,
    } = req.query;

    // Build filter object
    const filter: any = {};

    // Only filter by isActive if explicitly provided
    if (isActive !== undefined) {
      filter.isActive = isActive === "true";
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Build sort object
    const sort: any = {};
    sort[sortBy as string] = sortOrder === "desc" ? -1 : 1;

    // Calculate pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    let query = Category.find(filter)
      .select("-metadata")
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    // Populate books count if requested
    if (includeBooksCount === "true") {
      query = query.populate("booksCount");
    }

    const categories = await query.lean();

    // Get total count for pagination
    const total = await Category.countDocuments(filter);

    res.status(200).json({
      status: "success",
      results: categories.length,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalCategories: total,
        hasNextPage: pageNum < Math.ceil(total / limitNum),
        hasPrevPage: pageNum > 1,
      },
      data: {
        categories,
      },
    });
  }
);

export const getCategory = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { includeBooksCount = false } = req.query;

    let query = Category.findById(id)
      .populate("metadata.addedBy", "firstName lastName")
      .populate("metadata.lastModifiedBy", "firstName lastName");

    if (includeBooksCount === "true") {
      query = query.populate("booksCount");
    }

    const category = await query;

    if (!category) {
      return res.status(404).json({
        status: "error",
        message: "No category found with that ID",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        category,
      },
    });
  }
);

export const createCategory = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const categoryData = {
      ...req.body,
      metadata: {
        addedBy: req.user!._id,
        lastModifiedBy: req.user!._id,
      },
    };

    const category = await Category.create(categoryData);

    res.status(201).json({
      status: "success",
      data: {
        category,
      },
    });
  }
);

export const updateCategory = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;

    const updateData = {
      ...req.body,
      "metadata.lastModifiedBy": req.user!._id,
      "metadata.lastModifiedAt": new Date(),
    };

    const category = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return res.status(404).json({
        status: "error",
        message: "No category found with that ID",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        category,
      },
    });
  }
);

export const deleteCategory = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;

    const category = await Category.findByIdAndUpdate(
      id,
      {
        isActive: false,
        "metadata.lastModifiedBy": req.user!._id,
        "metadata.lastModifiedAt": new Date(),
      },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({
        status: "error",
        message: "No category found with that ID",
      });
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);

export const getActiveCategories = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const categories = await Category.find({ isActive: true })
      .select("name description slug")
      .sort({ name: 1 })
      .lean();

    res.status(200).json({
      status: "success",
      results: categories.length,
      data: {
        categories,
      },
    });
  }
);
