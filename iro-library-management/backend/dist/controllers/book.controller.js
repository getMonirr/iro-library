"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBookFormData = exports.searchBooks = exports.getBookCategories = exports.getPopularBooks = exports.getFeaturedBooks = exports.deleteBook = exports.updateBook = exports.createBook = exports.getBook = exports.getAllBooks = void 0;
const express_validator_1 = require("express-validator");
const errorHandler_1 = require("../middleware/errorHandler");
const Book_1 = __importDefault(require("../models/Book"));
const Category_1 = __importDefault(require("../models/Category"));
const Publisher_1 = __importDefault(require("../models/Publisher"));
exports.getAllBooks = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const { page = 1, limit = 10, category, author, language, search, sortBy = "createdAt", sortOrder = "desc", isActive, isFeatured, } = req.query;
    const filter = {};
    if (isActive !== undefined) {
        filter.isActive = isActive === "true";
    }
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
            { isbn: { $regex: search, $options: "i" } },
            { isbn13: { $regex: search, $options: "i" } },
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
        .limit(parseInt(limit))
        .sort({ createdAt: -1 })
        .lean();
    res.status(200).json({
        status: "success",
        results: books.length,
        data: {
            books,
        },
    });
});
exports.getPopularBooks = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const { limit = 10 } = req.query;
    const books = await Book_1.default.find({ isActive: true })
        .select("-metadata")
        .sort({ "statistics.views": -1, "statistics.borrows": -1 })
        .limit(parseInt(limit))
        .lean();
    res.status(200).json({
        status: "success",
        results: books.length,
        data: {
            books,
        },
    });
});
exports.getBookCategories = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const categories = await Book_1.default.distinct("categories", { isActive: true });
    res.status(200).json({
        status: "success",
        data: {
            categories,
        },
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
    const [categories, publishers] = await Promise.all([
        Category_1.default.find({ isActive: true })
            .select("name description slug")
            .sort({ name: 1 })
            .lean(),
        Publisher_1.default.find({ isActive: true })
            .select("name description website")
            .sort({ name: 1 })
            .lean(),
    ]);
    return res.status(200).json({
        status: "success",
        data: {
            categories,
            publishers,
        },
    });
});
//# sourceMappingURL=book.controller.js.map