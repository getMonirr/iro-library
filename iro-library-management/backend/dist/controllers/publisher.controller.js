"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActivePublishers = exports.deletePublisher = exports.updatePublisher = exports.createPublisher = exports.getPublisher = exports.getAllPublishers = void 0;
const express_validator_1 = require("express-validator");
const errorHandler_1 = require("../middleware/errorHandler");
const Publisher_1 = __importDefault(require("../models/Publisher"));
exports.getAllPublishers = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const { page = 1, limit = 50, search, sortBy = "name", sortOrder = "asc", isActive, country, includeBooksCount = false, } = req.query;
    const filter = {};
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
    const sort = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;
    let query = Publisher_1.default.find(filter)
        .select("-metadata")
        .sort(sort)
        .skip(skip)
        .limit(limitNum);
    if (includeBooksCount === "true") {
        query = query.populate("booksCount");
    }
    const publishers = await query.lean();
    const total = await Publisher_1.default.countDocuments(filter);
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
});
exports.getPublisher = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const { includeBooksCount = false } = req.query;
    let query = Publisher_1.default.findById(id)
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
});
exports.createPublisher = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
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
            addedBy: req.user._id,
            lastModifiedBy: req.user._id,
        },
    };
    const publisher = await Publisher_1.default.create(publisherData);
    return res.status(201).json({
        status: "success",
        data: {
            publisher,
        },
    });
});
exports.updatePublisher = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const updateData = {
        ...req.body,
        "metadata.lastModifiedBy": req.user._id,
        "metadata.lastModifiedAt": new Date(),
    };
    const publisher = await Publisher_1.default.findByIdAndUpdate(id, updateData, {
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
});
exports.deletePublisher = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const publisher = await Publisher_1.default.findByIdAndUpdate(id, {
        isActive: false,
        "metadata.lastModifiedBy": req.user._id,
        "metadata.lastModifiedAt": new Date(),
    }, { new: true });
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
});
exports.getActivePublishers = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const publishers = await Publisher_1.default.find({ isActive: true })
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
});
//# sourceMappingURL=publisher.controller.js.map