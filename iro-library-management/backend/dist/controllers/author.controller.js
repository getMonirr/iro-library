"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthorsForSelect = exports.deleteAuthor = exports.updateAuthor = exports.createAuthor = exports.getAuthor = exports.getAllAuthors = void 0;
const errorHandler_1 = require("../middleware/errorHandler");
const Author_1 = require("../models/Author");
exports.getAllAuthors = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const filter = {};
    if (req.query.search) {
        filter.$or = [
            { name: { $regex: req.query.search, $options: "i" } },
            { description: { $regex: req.query.search, $options: "i" } },
            { nationality: { $regex: req.query.search, $options: "i" } },
        ];
    }
    if (req.query.isActive !== undefined) {
        filter.isActive = req.query.isActive === "true";
    }
    if (req.query.nationality) {
        filter.nationality = { $regex: req.query.nationality, $options: "i" };
    }
    const authors = await Author_1.Author.find(filter)
        .sort({ name: 1 })
        .skip(skip)
        .limit(limit)
        .select("name slug description nationality photo isActive createdAt")
        .lean();
    const totalAuthors = await Author_1.Author.countDocuments(filter);
    const totalPages = Math.ceil(totalAuthors / limit);
    res.status(200).json({
        status: "success",
        data: {
            authors,
            pagination: {
                currentPage: page,
                totalPages,
                totalAuthors,
                hasNext: page < totalPages,
                hasPrev: page > 1,
            },
        },
    });
});
exports.getAuthor = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    let author = await Author_1.Author.findById(id);
    if (!author) {
        author = await Author_1.Author.findOne({ slug: id });
    }
    if (!author) {
        return res.status(404).json({
            status: "error",
            message: "No author found with that ID",
        });
    }
    res.status(200).json({
        status: "success",
        data: {
            author,
        },
    });
});
exports.createAuthor = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const { name, description, biography, birthDate, deathDate, nationality, photo, website, socialMedia, genres, awards, isActive = true, } = req.body;
    const author = await Author_1.Author.create({
        name,
        description,
        biography,
        birthDate,
        deathDate,
        nationality,
        photo,
        website,
        socialMedia,
        genres,
        awards,
        isActive,
        metadata: {
            addedBy: req.user?._id,
            lastModifiedBy: req.user?._id,
            addedAt: new Date(),
            lastModifiedAt: new Date(),
        },
    });
    res.status(201).json({
        status: "success",
        data: {
            author,
        },
    });
});
exports.updateAuthor = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const { name, description, biography, birthDate, deathDate, nationality, photo, website, socialMedia, genres, awards, isActive, } = req.body;
    const author = await Author_1.Author.findByIdAndUpdate(id, {
        name,
        description,
        biography,
        birthDate,
        deathDate,
        nationality,
        photo,
        website,
        socialMedia,
        genres,
        awards,
        isActive,
        "metadata.lastModifiedBy": req.user?._id,
        "metadata.lastModifiedAt": new Date(),
    }, {
        new: true,
        runValidators: true,
    });
    if (!author) {
        return res.status(404).json({
            status: "error",
            message: "No author found with that ID",
        });
    }
    res.status(200).json({
        status: "success",
        data: {
            author,
        },
    });
});
exports.deleteAuthor = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const author = await Author_1.Author.findByIdAndDelete(id);
    if (!author) {
        return res.status(404).json({
            status: "error",
            message: "No author found with that ID",
        });
    }
    res.status(204).json({
        status: "success",
        data: null,
    });
});
exports.getAuthorsForSelect = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const authors = await Author_1.Author.find({ isActive: true })
        .select("_id name description")
        .sort({ name: 1 })
        .lean();
    res.status(200).json({
        status: "success",
        data: {
            authors,
        },
    });
});
//# sourceMappingURL=author.controller.js.map