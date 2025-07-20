import { Response } from "express";
import { validationResult } from "express-validator";
import { AuthenticatedRequest } from "../middleware/auth";
import { catchAsync } from "../middleware/errorHandler";
import Book from "../models/Book";

export const getAllBooks = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const {
      page = 1,
      limit = 10,
      category,
      author,
      language,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
      isActive = true,
      isFeatured,
    } = req.query;

    // Build filter object
    const filter: any = { isActive };

    if (category) {
      filter.categories = { $in: [category] };
    }

    if (author) {
      filter.authors = { $regex: author, $options: "i" };
    }

    if (language) {
      filter.language = language;
    }

    if (isFeatured !== undefined) {
      filter.isFeatured = isFeatured === "true";
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { authors: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
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
    const books = await Book.find(filter)
      .select("-metadata")
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .populate("metadata.addedBy", "firstName lastName")
      .lean();

    // Get total count for pagination
    const total = await Book.countDocuments(filter);

    res.status(200).json({
      status: "success",
      results: books.length,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalBooks: total,
        hasNextPage: pageNum < Math.ceil(total / limitNum),
        hasPrevPage: pageNum > 1,
      },
      data: {
        books,
      },
    });
  }
);

export const getBook = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;

    const book = await Book.findByIdAndUpdate(
      id,
      { $inc: { "statistics.views": 1 } },
      { new: true }
    )
      .populate("metadata.addedBy", "firstName lastName")
      .populate("metadata.lastModifiedBy", "firstName lastName");

    if (!book) {
      return res.status(404).json({
        status: "error",
        message: "No book found with that ID",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        book,
      },
    });
  }
);

export const createBook = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const bookData = {
      ...req.body,
      metadata: {
        addedBy: req.user!._id,
        lastModifiedBy: req.user!._id,
      },
    };

    const book = await Book.create(bookData);

    res.status(201).json({
      status: "success",
      data: {
        book,
      },
    });
  }
);

export const updateBook = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;

    const updateData = {
      ...req.body,
      "metadata.lastModifiedBy": req.user!._id,
      "metadata.lastModifiedAt": new Date(),
    };

    const book = await Book.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!book) {
      return res.status(404).json({
        status: "error",
        message: "No book found with that ID",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        book,
      },
    });
  }
);

export const deleteBook = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;

    const book = await Book.findByIdAndUpdate(
      id,
      {
        isActive: false,
        "metadata.lastModifiedBy": req.user!._id,
        "metadata.lastModifiedAt": new Date(),
      },
      { new: true }
    );

    if (!book) {
      return res.status(404).json({
        status: "error",
        message: "No book found with that ID",
      });
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);

export const getFeaturedBooks = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const { limit = 10 } = req.query;

    const books = await Book.find({
      isActive: true,
      isFeatured: true,
    })
      .select("-metadata")
      .limit(parseInt(limit as string))
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      status: "success",
      results: books.length,
      data: {
        books,
      },
    });
  }
);

export const getPopularBooks = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const { limit = 10 } = req.query;

    const books = await Book.find({ isActive: true })
      .select("-metadata")
      .sort({ "statistics.views": -1, "statistics.borrows": -1 })
      .limit(parseInt(limit as string))
      .lean();

    res.status(200).json({
      status: "success",
      results: books.length,
      data: {
        books,
      },
    });
  }
);

export const getBookCategories = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const categories = await Book.distinct("categories", { isActive: true });

    res.status(200).json({
      status: "success",
      data: {
        categories,
      },
    });
  }
);

export const searchBooks = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const { q, page = 1, limit = 10 } = req.query;

    if (!q) {
      return res.status(400).json({
        status: "error",
        message: "Search query is required",
      });
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Create text search
    const books = await Book.find(
      {
        $text: { $search: q as string },
        isActive: true,
      },
      { score: { $meta: "textScore" } }
    )
      .select("-metadata")
      .sort({ score: { $meta: "textScore" } })
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await Book.countDocuments({
      $text: { $search: q as string },
      isActive: true,
    });

    res.status(200).json({
      status: "success",
      results: books.length,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalBooks: total,
      },
      data: {
        books,
      },
    });
  }
);
