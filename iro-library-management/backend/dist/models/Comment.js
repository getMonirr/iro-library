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
const commentSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"],
    },
    book: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Book",
        required: [true, "Book is required"],
    },
    parentComment: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Comment",
        default: null,
    },
    content: {
        type: String,
        required: [true, "Comment content is required"],
        trim: true,
        maxlength: [1000, "Comment cannot exceed 1000 characters"],
    },
    isEdited: {
        type: Boolean,
        default: false,
    },
    editHistory: [
        {
            content: {
                type: String,
                required: true,
            },
            editedAt: {
                type: Date,
                required: true,
                default: Date.now,
            },
        },
    ],
    likes: {
        type: Number,
        default: 0,
        min: 0,
    },
    replies: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Comment",
        },
    ],
    isReported: {
        type: Boolean,
        default: false,
    },
    reportReasons: [
        {
            reason: {
                type: String,
                required: true,
                enum: [
                    "spam",
                    "inappropriate",
                    "harassment",
                    "offensive",
                    "copyright",
                    "other",
                ],
            },
            reportedBy: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            reportedAt: {
                type: Date,
                required: true,
                default: Date.now,
            },
            status: {
                type: String,
                enum: ["pending", "reviewed", "resolved", "dismissed"],
                default: "pending",
            },
        },
    ],
    isModerated: {
        type: Boolean,
        default: false,
    },
    moderatedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    moderatedAt: Date,
    moderationReason: String,
    isHidden: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
commentSchema.virtual("replyCount").get(function () {
    return this.replies.length;
});
commentSchema.pre("save", function (next) {
    if (this.isModified("content") && !this.isNew) {
        this.editHistory.push({
            content: this.content,
            editedAt: new Date(),
        });
        this.isEdited = true;
    }
    next();
});
commentSchema.index({ book: 1, createdAt: -1 });
commentSchema.index({ user: 1, createdAt: -1 });
commentSchema.index({ parentComment: 1 });
commentSchema.index({ isReported: 1 });
commentSchema.index({ isModerated: 1 });
commentSchema.index({ isHidden: 1 });
const Comment = mongoose_1.default.model("Comment", commentSchema);
exports.default = Comment;
//# sourceMappingURL=Comment.js.map