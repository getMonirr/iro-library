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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Author = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const slugify_1 = __importDefault(require("slugify"));
const authorSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Author name is required"],
        trim: true,
        maxlength: [200, "Author name cannot exceed 200 characters"],
    },
    slug: {
        type: String,
        unique: true,
        index: true,
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, "Description cannot exceed 500 characters"],
    },
    biography: {
        type: String,
        trim: true,
        maxlength: [2000, "Biography cannot exceed 2000 characters"],
    },
    birthDate: {
        type: Date,
    },
    deathDate: {
        type: Date,
    },
    nationality: {
        type: String,
        trim: true,
        maxlength: [100, "Nationality cannot exceed 100 characters"],
    },
    photo: {
        type: String,
        trim: true,
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
            message: "Please enter a valid website URL",
        },
    },
    socialMedia: {
        twitter: {
            type: String,
            trim: true,
        },
        facebook: {
            type: String,
            trim: true,
        },
        instagram: {
            type: String,
            trim: true,
        },
        linkedin: {
            type: String,
            trim: true,
        },
    },
    genres: [
        {
            type: String,
            trim: true,
        },
    ],
    awards: [
        {
            type: String,
            trim: true,
        },
    ],
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
authorSchema.pre("save", function (next) {
    if (this.isNew || this.isModified("name")) {
        this.slug = (0, slugify_1.default)(this.name, {
            lower: true,
            strict: true,
            remove: /[*+~.()'"!:@]/g,
        });
    }
    next();
});
authorSchema.pre("findOneAndUpdate", function (next) {
    this.set({ "metadata.lastModifiedAt": new Date() });
    next();
});
authorSchema.index({ name: 1 });
authorSchema.index({ slug: 1 });
authorSchema.index({ nationality: 1 });
authorSchema.index({ isActive: 1 });
authorSchema.index({ "metadata.addedAt": -1 });
exports.Author = mongoose_1.default.model("Author", authorSchema);
exports.default = exports.Author;
//# sourceMappingURL=Author.js.map