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
const borrowSchema = new mongoose_1.Schema({
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
    borrowDate: {
        type: Date,
        required: true,
        default: Date.now,
    },
    dueDate: {
        type: Date,
        required: true,
    },
    returnDate: Date,
    actualReturnDate: Date,
    status: {
        type: String,
        enum: ["active", "returned", "overdue", "lost", "damaged"],
        default: "active",
    },
    renewalCount: {
        type: Number,
        default: 0,
        min: 0,
    },
    renewalHistory: [
        {
            renewedDate: {
                type: Date,
                required: true,
            },
            previousDueDate: {
                type: Date,
                required: true,
            },
            newDueDate: {
                type: Date,
                required: true,
            },
            renewedBy: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            reason: String,
        },
    ],
    fines: [
        {
            type: {
                type: String,
                enum: ["late_return", "damage", "lost", "other"],
                required: true,
            },
            amount: {
                type: Number,
                required: true,
                min: 0,
            },
            description: {
                type: String,
                required: true,
            },
            dateIssued: {
                type: Date,
                required: true,
                default: Date.now,
            },
            datePaid: Date,
            status: {
                type: String,
                enum: ["pending", "paid", "waived"],
                default: "pending",
            },
            issuedBy: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            paidTo: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: "User",
            },
        },
    ],
    notes: [
        {
            text: {
                type: String,
                required: true,
                maxlength: 500,
            },
            addedBy: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            addedAt: {
                type: Date,
                default: Date.now,
            },
            type: {
                type: String,
                enum: ["general", "condition", "reminder", "warning"],
                default: "general",
            },
        },
    ],
    remindersSent: [
        {
            type: {
                type: String,
                enum: ["due_soon", "overdue", "final_notice"],
                required: true,
            },
            sentDate: {
                type: Date,
                required: true,
                default: Date.now,
            },
            method: {
                type: String,
                enum: ["email", "sms", "in_person"],
                required: true,
            },
        },
    ],
    issuedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    returnedTo: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    digitalAccess: {
        accessGranted: {
            type: Boolean,
            default: false,
        },
        accessExpiry: Date,
        downloadCount: {
            type: Number,
            default: 0,
            min: 0,
        },
        maxDownloads: {
            type: Number,
            default: 3,
            min: 1,
        },
        ipRestrictions: [String],
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
borrowSchema.virtual("daysBorrowed").get(function () {
    const endDate = this.actualReturnDate || new Date();
    const startDate = this.borrowDate;
    return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
});
borrowSchema.virtual("daysOverdue").get(function () {
    if (this.status !== "overdue" && this.status !== "active")
        return 0;
    const today = new Date();
    const dueDate = this.dueDate;
    if (today <= dueDate)
        return 0;
    return Math.ceil((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
});
borrowSchema.virtual("totalFines").get(function () {
    return this.fines
        .filter((fine) => fine.status === "pending")
        .reduce((total, fine) => total + fine.amount, 0);
});
borrowSchema.pre("save", function (next) {
    if (this.status === "active" && new Date() > this.dueDate) {
        this.status = "overdue";
    }
    next();
});
borrowSchema.pre("validate", function (next) {
    if (this.dueDate <= this.borrowDate) {
        next(new Error("Due date must be after borrow date"));
    }
    else {
        next();
    }
});
borrowSchema.index({ user: 1, status: 1 });
borrowSchema.index({ book: 1, status: 1 });
borrowSchema.index({ status: 1, dueDate: 1 });
borrowSchema.index({ borrowDate: -1 });
borrowSchema.index({ dueDate: 1 });
borrowSchema.index({ user: 1, book: 1, borrowDate: -1 });
const Borrow = mongoose_1.default.model("Borrow", borrowSchema);
exports.default = Borrow;
//# sourceMappingURL=Borrow.js.map