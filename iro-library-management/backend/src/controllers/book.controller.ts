import { Response } from "express";
import { validationResult } from "express-validator";
import { AuthenticatedRequest } from "../middleware/auth";
import { catchAsync } from "../middleware/errorHandler";
import Author from "../models/Author";
import Book from "../models/Book";
import Borrow from "../models/Borrow";
import Category from "../models/Category";
import Publisher from "../models/Publisher";
import User from "../models/User";

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
      isActive,
      isFeatured,
    } = req.query;

    // Build filter object
    const filter: any = {};

    // Only filter by isActive if explicitly provided
    if (isActive !== undefined) {
      filter.isActive = isActive === "true";
    }

    if (category) {
      // If category is an ObjectId, use it directly; otherwise find by name
      let categoryIds: any[] = [];

      // Check if it's a valid ObjectId
      if (
        category &&
        typeof category === "string" &&
        category.match(/^[0-9a-fA-F]{24}$/)
      ) {
        categoryIds = [category];
      } else {
        // Find categories by name
        const matchingCategories = await Category.find({
          name: { $regex: category, $options: "i" },
        }).select("_id");
        categoryIds = matchingCategories.map((c) => c._id);
      }

      if (categoryIds.length > 0) {
        filter.categories = { $in: categoryIds };
      } else {
        // If no categories match, ensure no books are returned
        filter.categories = { $in: [] };
      }
    }

    if (author) {
      // Find authors by name and get their IDs
      const matchingAuthors = await Author.find({
        name: { $regex: author, $options: "i" },
      }).select("_id");

      const authorIds = matchingAuthors.map((a) => a._id);
      if (authorIds.length > 0) {
        filter.authors = { $in: authorIds };
      } else {
        // If no authors match, ensure no books are returned
        filter.authors = { $in: [] };
      }
    }

    if (language) {
      filter.language = language;
    }

    if (isFeatured !== undefined) {
      filter.isFeatured = isFeatured === "true";
    }

    if (search) {
      // For searching authors by name, we need to find author IDs first
      const matchingAuthors = await Author.find({
        name: { $regex: search, $options: "i" },
      }).select("_id");

      const authorIds = matchingAuthors.map((author) => author._id);

      // For searching categories by name, we need to find category IDs first
      const matchingCategories = await Category.find({
        name: { $regex: search, $options: "i" },
      }).select("_id");

      const categoryIds = matchingCategories.map((category) => category._id);

      // For searching publishers by name, we need to find publisher IDs first
      const matchingPublishers = await Publisher.find({
        name: { $regex: search, $options: "i" },
      }).select("_id");

      const publisherIds = matchingPublishers.map((publisher) => publisher._id);

      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
        { language: { $regex: search, $options: "i" } },
        { bookId: { $regex: search, $options: "i" } },
        ...(authorIds.length > 0 ? [{ authors: { $in: authorIds } }] : []),
        ...(categoryIds.length > 0
          ? [{ categories: { $in: categoryIds } }]
          : []),
        ...(publisherIds.length > 0
          ? [{ publisher: { $in: publisherIds } }]
          : []),
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
      .populate("authors", "name")
      .populate("publisher", "name")
      .populate("categories", "name")
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
      .populate("authors", "name")
      .populate("publisher", "name")
      .populate("categories", "name")
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
      .populate("authors", "name")
      .populate("publisher", "name")
      .populate("categories", "name")
      .limit(parseInt(limit as string))
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: {
        books,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalBooks: books.length,
          hasNext: false,
          hasPrev: false,
        },
      },
    });
  }
);

export const getPopularBooks = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const { limit = 10 } = req.query;

    const books = await Book.find({ isActive: true })
      .select("-metadata")
      .populate("authors", "name")
      .populate("publisher", "name")
      .populate("categories", "name")
      .sort({ "statistics.views": -1, "statistics.borrows": -1 })
      .limit(parseInt(limit as string))
      .lean();

    res.status(200).json({
      success: true,
      data: {
        books,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalBooks: books.length,
          hasNext: false,
          hasPrev: false,
        },
      },
    });
  }
);

export const getBookCategories = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const categories = await Category.find({ isActive: true })
      .select("name")
      .lean();

    const categoryNames = categories.map((cat) => cat.name);

    res.status(200).json({
      success: true,
      data: categoryNames,
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
      .populate("authors", "name")
      .populate("publisher", "name")
      .populate("categories", "name")
      .sort({ score: { $meta: "textScore" } })
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await Book.countDocuments({
      $text: { $search: q as string },
      isActive: true,
    });

    return res.status(200).json({
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

export const getBookFormData = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    // Get active categories, publishers, and authors for form dropdowns
    const [categories, publishers, authors] = await Promise.all([
      Category.find({ isActive: true })
        .select("name description slug")
        .sort({ name: 1 })
        .lean(),
      Publisher.find({ isActive: true })
        .select("name description website")
        .sort({ name: 1 })
        .lean(),
      Author.find({ isActive: true })
        .select("name description nationality")
        .sort({ name: 1 })
        .lean(),
    ]);

    return res.status(200).json({
      status: "success",
      data: {
        categories,
        publishers,
        authors,
      },
    });
  }
);

export const getLibraryStats = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const [totalBooks, totalBorrows, totalMembers, totalCategories] =
      await Promise.all([
        Book.countDocuments({ isActive: true }),
        Borrow.countDocuments(),
        User.countDocuments({ role: { $ne: "admin" } }),
        Category.countDocuments({ isActive: true }),
      ]);

    res.status(200).json({
      success: true,
      data: {
        totalBooks,
        totalBorrows,
        totalMembers,
        totalCategories,
      },
    });
  }
);
