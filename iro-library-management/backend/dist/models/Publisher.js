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
const publisherSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Publisher name is required"],
        trim: true,
        unique: true,
        maxlength: [200, "Publisher name cannot exceed 200 characters"],
    },
    description: {
        type: String,
        trim: true,
        maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    website: {
        type: String,
        trim: true,
        validate: {
            validator: function (v) {
                if (!v)
                    return true;
                return /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/.test(v);
            },
            message: "Please provide a valid website URL",
        },
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        validate: {
            validator: function (v) {
                if (!v)
                    return true;
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: "Please provide a valid email address",
        },
    },
    phone: {
        type: String,
        trim: true,
    },
    address: {
        street: {
            type: String,
            trim: true,
        },
        city: {
            type: String,
            trim: true,
        },
        state: {
            type: String,
            trim: true,
        },
        country: {
            type: String,
            trim: true,
        },
        zipCode: {
            type: String,
            trim: true,
        },
    },
    establishedYear: {
        type: Number,
        min: [1000, "Established year must be a valid year"],
        max: [
            new Date().getFullYear(),
            "Established year cannot be in the future",
        ],
    },
    logo: {
        type: String,
        trim: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    metadata: {
        addedBy: {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        lastModifiedBy: {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        addedAt: {
            type: Date,
            default: Date.now,
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
publisherSchema.index({ name: 1 });
publisherSchema.index({ isActive: 1 });
publisherSchema.index({ "address.country": 1 });
publisherSchema.virtual("booksCount", {
    ref: "Book",
    localField: "name",
    foreignField: "publisher",
    count: true,
});
const Publisher = mongoose_1.default.model("Publisher", publisherSchema);
exports.default = Publisher;
//# sourceMappingURL=Publisher.js.map