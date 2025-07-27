import { Response } from "express";
import { validationResult } from "express-validator";
import { AuthenticatedRequest } from "../middleware/auth";
import { catchAsync } from "../middleware/errorHandler";
import Publisher from "../models/Publisher";

export const getAllPublishers = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const {
      page = 1,
      limit = 50,
      search,
      sortBy = "name",
      sortOrder = "asc",
      isActive,
      country,
      includeBooksCount = false,
    } = req.query;

    // Build filter object
    const filter: any = {};

    // Only filter by isActive if explicitly provided
    if (isActive !== undefined) {
      filter.isActive = isActive === "true";
    }

    if (country) {
      filter["address.country"] = { $regex: country, $options: "i" };
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { "address.city": { $regex: search, $options: "i" } },
        { "address.country": { $regex: search, $options: "i" } },
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
    let query = Publisher.find(filter)
      .select("-metadata")
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    // Populate books count if requested
    if (includeBooksCount === "true") {
      query = query.populate("booksCount");
    }

    const publishers = await query.lean();

    // Get total count for pagination
    const total = await Publisher.countDocuments(filter);

    res.status(200).json({
      status: "success",
      results: publishers.length,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalPublishers: total,
        hasNextPage: pageNum < Math.ceil(total / limitNum),
        hasPrevPage: pageNum > 1,
      },
      data: {
        publishers,
      },
    });
  }
);

export const getPublisher = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { includeBooksCount = false } = req.query;

    let query = Publisher.findById(id)
      .populate("metadata.addedBy", "firstName lastName")
      .populate("metadata.lastModifiedBy", "firstName lastName");

    if (includeBooksCount === "true") {
      query = query.populate("booksCount");
    }

    const publisher = await query;

    if (!publisher) {
      return res.status(404).json({
        status: "error",
        message: "No publisher found with that ID",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        publisher,
      },
    });
  }
);

export const createPublisher = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const publisherData = {
      ...req.body,
      metadata: {
        addedBy: req.user!._id,
        lastModifiedBy: req.user!._id,
      },
    };

    const publisher = await Publisher.create(publisherData);

    return res.status(201).json({
      status: "success",
      data: {
        publisher,
      },
    });
  }
);

export const updatePublisher = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;

    const updateData = {
      ...req.body,
      "metadata.lastModifiedBy": req.user!._id,
      "metadata.lastModifiedAt": new Date(),
    };

    const publisher = await Publisher.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!publisher) {
      return res.status(404).json({
        status: "error",
        message: "No publisher found with that ID",
      });
    }

    return res.status(200).json({
      status: "success",
      data: {
        publisher,
      },
    });
  }
);

export const deletePublisher = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;

    const publisher = await Publisher.findByIdAndUpdate(
      id,
      {
        isActive: false,
        "metadata.lastModifiedBy": req.user!._id,
        "metadata.lastModifiedAt": new Date(),
      },
      { new: true }
    );

    if (!publisher) {
      return res.status(404).json({
        status: "error",
        message: "No publisher found with that ID",
      });
    }

    return res.status(204).json({
      status: "success",
      data: null,
    });
  }
);

export const getActivePublishers = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const publishers = await Publisher.find({ isActive: true })
      .select("name description website")
      .sort({ name: 1 })
      .lean();

    return res.status(200).json({
      status: "success",
      results: publishers.length,
      data: {
        publishers,
      },
    });
  }
);
