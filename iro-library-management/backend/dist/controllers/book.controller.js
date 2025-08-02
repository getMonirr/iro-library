"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLibraryStats = exports.getBookFormData = exports.searchBooks = exports.getBookCategories = exports.getPopularBooks = exports.getFeaturedBooks = exports.deleteBook = exports.updateBook = exports.createBook = exports.getBook = exports.getAllBooks = void 0;
const express_validator_1 = require("express-validator");
const errorHandler_1 = require("../middleware/errorHandler");
const Author_1 = __importDefault(require("../models/Author"));
const Book_1 = __importDefault(require("../models/Book"));
const Category_1 = __importDefault(require("../models/Category"));
const Publisher_1 = __importDefault(require("../models/Publisher"));
const User_1 = __importDefault(require("../models/User"));
const Borrow_1 = __importDefault(require("../models/Borrow"));
exports.getAllBooks = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const { page = 1, limit = 10, category, author, language, search, sortBy = "createdAt", sortOrder = "desc", isActive, isFeatured, } = req.query;
    const filter = {};
    if (isActive !== undefined) {
        filter.isActive = isActive === "true";
    }
    if (category) {
        let categoryIds = [];
        if (category &&
            typeof category === "string" &&
            category.match(/^[0-9a-fA-F]{24}$/)) {
            categoryIds = [category];
        }
        else {
            const matchingCategories = await Category_1.default.find({
                name: { $regex: category, $options: "i" },
            }).select("_id");
            categoryIds = matchingCategories.map((c) => c._id);
        }
        if (categoryIds.length > 0) {
            filter.categories = { $in: categoryIds };
        }
        else {
            filter.categories = { $in: [] };
        }
    }
    if (author) {
        const matchingAuthors = await Author_1.default.find({
            name: { $regex: author, $options: "i" },
        }).select("_id");
        const authorIds = matchingAuthors.map((a) => a._id);
        if (authorIds.length > 0) {
            filter.authors = { $in: authorIds };
        }
        else {
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
        const matchingAuthors = await Author_1.default.find({
            name: { $regex: search, $options: "i" },
        }).select("_id");
        const authorIds = matchingAuthors.map((author) => author._id);
        const matchingCategories = await Category_1.default.find({
            name: { $regex: search, $options: "i" },
        }).select("_id");
        const categoryIds = matchingCategories.map((category) => category._id);
        const matchingPublishers = await Publisher_1.default.find({
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
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    const books = await Book_1.default.find(filter)
        .select("-metadata")
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .populate("authors", "name")
        .populate("publisher", "name")
        .populate("categories", "name")
        .populate("metadata.addedBy", "firstName lastName")
        .lean();
    const total = await Book_1.default.countDocuments(filter);
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
});
exports.getBook = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const book = await Book_1.default.findByIdAndUpdate(id, { $inc: { "statistics.views": 1 } }, { new: true })
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
});
exports.createBook = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
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
            addedBy: req.user._id,
            lastModifiedBy: req.user._id,
        },
    };
    const book = await Book_1.default.create(bookData);
    res.status(201).json({
        status: "success",
        data: {
            book,
        },
    });
});
exports.updateBook = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const updateData = {
        ...req.body,
        "metadata.lastModifiedBy": req.user._id,
        "metadata.lastModifiedAt": new Date(),
    };
    const book = await Book_1.default.findByIdAndUpdate(id, updateData, {
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
});
exports.deleteBook = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const book = await Book_1.default.findByIdAndUpdate(id, {
        isActive: false,
        "metadata.lastModifiedBy": req.user._id,
        "metadata.lastModifiedAt": new Date(),
    }, { new: true });
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
});
exports.getFeaturedBooks = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const { limit = 10 } = req.query;
    const books = await Book_1.default.find({
        isActive: true,
        isFeatured: true,
    })
        .select("-metadata")
        .populate("authors", "name")
        .populate("publisher", "name")
        .populate("categories", "name")
        .limit(parseInt(limit))
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
});
exports.getPopularBooks = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const { limit = 10 } = req.query;
    const books = await Book_1.default.find({ isActive: true })
        .select("-metadata")
        .populate("authors", "name")
        .populate("publisher", "name")
        .populate("categories", "name")
        .sort({ "statistics.views": -1, "statistics.borrows": -1 })
        .limit(parseInt(limit))
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
});
exports.getBookCategories = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const categories = await Category_1.default.find({ isActive: true })
        .select("name")
        .lean();
    const categoryNames = categories.map(cat => cat.name);
    res.status(200).json({
        success: true,
        data: categoryNames,
    });
});
exports.searchBooks = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const { q, page = 1, limit = 10 } = req.query;
    if (!q) {
        return res.status(400).json({
            status: "error",
            message: "Search query is required",
        });
    }
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    const books = await Book_1.default.find({
        $text: { $search: q },
        isActive: true,
    }, { score: { $meta: "textScore" } })
        .select("-metadata")
        .populate("authors", "name")
        .populate("publisher", "name")
        .populate("categories", "name")
        .sort({ score: { $meta: "textScore" } })
        .skip(skip)
        .limit(limitNum)
        .lean();
    const total = await Book_1.default.countDocuments({
        $text: { $search: q },
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
});
exports.getBookFormData = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const [categories, publishers, authors] = await Promise.all([
        Category_1.default.find({ isActive: true })
            .select("name description slug")
            .sort({ name: 1 })
            .lean(),
        Publisher_1.default.find({ isActive: true })
            .select("name description website")
            .sort({ name: 1 })
            .lean(),
        Author_1.default.find({ isActive: true })
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
});
exports.getLibraryStats = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const [totalBooks, totalBorrows, totalMembers, totalCategories] = await Promise.all([
        Book_1.default.countDocuments({ isActive: true }),
        Borrow_1.default.countDocuments(),
        User_1.default.countDocuments({ role: { $ne: 'admin' } }),
        Category_1.default.countDocuments({ isActive: true }),
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
});
//# sourceMappingURL=book.controller.js.map