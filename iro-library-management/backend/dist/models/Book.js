"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const bookSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, "Book title is required"],
        trim: true,
        maxlength: [200, "Title cannot exceed 200 characters"],
    },
    subtitle: {
        type: String,
        trim: true,
        maxlength: [200, "Subtitle cannot exceed 200 characters"],
    },
    authors: [
        {
            type: String,
            required: true,
            trim: true,
        },
    ],
    isbn: {
        type: String,
        unique: true,
        sparse: true,
        validate: {
            validator: function (v) {
                return /^(?:\d{9}[\dX]|\d{13})$/.test(v.replace(/-/g, ""));
            },
            message: "Please enter a valid ISBN",
        },
    },
    isbn13: {
        type: String,
        unique: true,
        sparse: true,
        validate: {
            validator: function (v) {
                return /^\d{13}$/.test(v.replace(/-/g, ""));
            },
            message: "Please enter a valid ISBN-13",
        },
    },
    publisher: {
        type: String,
        trim: true,
        maxlength: [100, "Publisher name cannot exceed 100 characters"],
    },
    publishedDate: Date,
    language: {
        type: String,
        required: [true, "Language is required"],
        default: "English",
    },
    pages: {
        type: Number,
        min: [1, "Pages must be at least 1"],
    },
    description: {
        type: String,
        maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    categories: [
        {
            type: String,
            required: true,
            enum: [
                "Quran & Tafsir",
                "Hadith",
                "Fiqh",
                "Aqeedah",
                "History",
                "Biography",
                "Islamic Philosophy",
                "Arabic Language",
                "Islamic Art",
                "Contemporary Issues",
                "Children Books",
                "General Knowledge",
                "Science & Technology",
                "Health & Medicine",
                "Education",
                "Literature",
                "Research & Reference",
            ],
        },
    ],
    tags: [
        {
            type: String,
            trim: true,
            lowercase: true,
        },
    ],
    coverImage: String,
    thumbnailImage: String,
    format: {
        type: String,
        enum: ["physical", "digital", "both"],
        required: true,
        default: "physical",
    },
    digitalFormats: [
        {
            type: String,
            enum: ["pdf", "epub", "mobi", "audiobook"],
        },
    ],
    fileUrl: String,
    audioUrl: String,
    totalCopies: {
        type: Number,
        required: true,
        min: [1, "Total copies must be at least 1"],
        default: 1,
    },
    availableCopies: {
        type: Number,
        required: true,
        min: [0, "Available copies cannot be negative"],
        default: 1,
    },
    location: {
        shelf: {
            type: String,
            required: function () {
                return this.format === "physical" || this.format === "both";
            },
        },
        section: {
            type: String,
            required: function () {
                return this.format === "physical" || this.format === "both";
            },
        },
        floor: String,
    },
    acquisitionInfo: {
        acquisitionDate: {
            type: Date,
            required: true,
            default: Date.now,
        },
        source: {
            type: String,
            enum: ["purchase", "donation", "exchange", "other"],
            required: true,
            default: "purchase",
        },
        cost: {
            type: Number,
            min: 0,
        },
        donor: String,
        notes: String,
    },
    condition: {
        type: String,
        enum: ["excellent", "good", "fair", "poor", "damaged"],
        required: function () {
            return this.format === "physical" || this.format === "both";
        },
        default: "excellent",
    },
    rating: {
        average: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        count: {
            type: Number,
            default: 0,
            min: 0,
        },
    },
    statistics: {
        views: { type: Number, default: 0 },
        likes: { type: Number, default: 0 },
        comments: { type: Number, default: 0 },
        shares: { type: Number, default: 0 },
        borrows: { type: Number, default: 0 },
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    isRestricted: {
        type: Boolean,
        default: false,
    },
    restrictionReason: String,
    minimumAge: {
        type: Number,
        min: 0,
        max: 100,
    },
    maxBorrowDays: {
        type: Number,
        default: 14,
        min: 1,
        max: 365,
    },
    renewalLimit: {
        type: Number,
        default: 2,
        min: 0,
        max: 10,
    },
    reservationLimit: {
        type: Number,
        default: 5,
        min: 0,
        max: 100,
    },
    metadata: {
        addedBy: {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        lastModifiedBy: {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        lastModifiedAt: {
            type: Date,
            default: Date.now,
        },
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
bookSchema.pre("validate", function (next) {
    if (this.availableCopies > this.totalCopies) {
        next(new Error("Available copies cannot exceed total copies"));
    }
    else {
        next();
    }
});
bookSchema.pre("save", function (next) {
    if (this.isModified() && !this.isNew) {
        this.metadata.lastModifiedAt = new Date();
    }
    next();
});
bookSchema.virtual("isAvailable").get(function () {
    return this.isActive && this.availableCopies > 0;
});
bookSchema.virtual("fullLocation").get(function () {
    const { floor, section, shelf } = this.location;
    return [floor, section, shelf].filter(Boolean).join(" - ");
});
bookSchema.index({ title: "text", authors: "text", description: "text" });
bookSchema.index({ categories: 1 });
bookSchema.index({ tags: 1 });
bookSchema.index({ isbn: 1 });
bookSchema.index({ isbn13: 1 });
bookSchema.index({ isActive: 1 });
bookSchema.index({ isFeatured: 1 });
bookSchema.index({ "statistics.views": -1 });
bookSchema.index({ "rating.average": -1 });
bookSchema.index({ createdAt: -1 });
bookSchema.index({ "metadata.addedBy": 1 });
const Book = mongoose_1.default.model("Book", bookSchema);
exports.default = Book;
//# sourceMappingURL=Book.js.map