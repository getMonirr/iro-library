"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActiveCategories = exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategory = exports.getAllCategories = void 0;
const express_validator_1 = require("express-validator");
const errorHandler_1 = require("../middleware/errorHandler");
const Category_1 = __importDefault(require("../models/Category"));
exports.getAllCategories = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const { page = 1, limit = 50, search, sortBy = "name", sortOrder = "asc", isActive, includeBooksCount = false, } = req.query;
    const filter = {};
    if (isActive !== undefined) {
        filter.isActive = isActive === "true";
    }
    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
        ];
    }
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    let query = Category_1.default.find(filter)
        .select("-metadata")
        .sort(sort)
        .skip(skip)
        .limit(limitNum);
    if (includeBooksCount === "true") {
        query = query.populate("booksCount");
    }
    const categories = await query.lean();
    const total = await Category_1.default.countDocuments(filter);
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
});
exports.getCategory = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const { includeBooksCount = false } = req.query;
    let query = Category_1.default.findById(id)
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
});
exports.createCategory = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
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
            addedBy: req.user._id,
            lastModifiedBy: req.user._id,
        },
    };
    const category = await Category_1.default.create(categoryData);
    res.status(201).json({
        status: "success",
        data: {
            category,
        },
    });
});
exports.updateCategory = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const updateData = {
        ...req.body,
        "metadata.lastModifiedBy": req.user._id,
        "metadata.lastModifiedAt": new Date(),
    };
    const category = await Category_1.default.findByIdAndUpdate(id, updateData, {
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
});
exports.deleteCategory = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const category = await Category_1.default.findByIdAndUpdate(id, {
        isActive: false,
        "metadata.lastModifiedBy": req.user._id,
        "metadata.lastModifiedAt": new Date(),
    }, { new: true });
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
});
exports.getActiveCategories = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const categories = await Category_1.default.find({ isActive: true })
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
});
//# sourceMappingURL=category.controller.js.map