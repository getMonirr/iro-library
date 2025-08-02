import mongoose, { Document, Schema } from "mongoose";
import { generateUniqueBookId } from "../utils/bookIdGenerator";

export interface IBook extends Document {
  _id: string;
  bookId: string;
  title: string;
  subtitle?: string;
  authors: mongoose.Types.ObjectId[];
  publisher?: mongoose.Types.ObjectId;
  publishedDate?: Date;
  language: string;
  pages?: number;
  description?: string;
  categories: mongoose.Types.ObjectId[];
  tags: string[];
  coverImage?: string;
  thumbnailImage?: string;
  format: "physical" | "digital" | "both";
  digitalFormats: ("pdf" | "epub" | "mobi" | "audiobook")[];
  fileUrl?: string;
  audioUrl?: string;
  totalCopies: number;
  availableCopies: number;
  location: {
    shelf: string;
    section: string;
    floor?: string;
  };
  acquisitionInfo: {
    acquisitionDate: Date;
    source: "purchase" | "donation" | "exchange" | "other";
    cost?: number;
    donor?: string;
    notes?: string;
  };
  condition: "excellent" | "good" | "fair" | "poor" | "damaged";
  rating: {
    average: number;
    count: number;
  };
  statistics: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
    borrows: number;
  };
  isActive: boolean;
  isFeatured: boolean;
  isRestricted: boolean;
  restrictionReason?: string;
  minimumAge?: number;
  maxBorrowDays: number;
  renewalLimit: number;
  reservationLimit: number;
  metadata: {
    addedBy: mongoose.Types.ObjectId;
    lastModifiedBy: mongoose.Types.ObjectId;
    lastModifiedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const bookSchema = new Schema<IBook>(
  {
    bookId: {
      type: String,
      unique: true,
      index: true,
    },
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
        type: mongoose.Schema.Types.ObjectId,
        ref: "Author",
        required: true,
      },
    ],
    publisher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Publisher",
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
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
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
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      lastModifiedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      lastModifiedAt: {
        type: Date,
        default: Date.now,
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Validation: available copies cannot exceed total copies
bookSchema.pre("validate", function (next) {
  if (this.availableCopies > this.totalCopies) {
    next(new Error("Available copies cannot exceed total copies"));
  } else {
    next();
  }
});

// Update lastModifiedAt on save
bookSchema.pre("save", function (next) {
  if (this.isModified() && !this.isNew) {
    this.metadata.lastModifiedAt = new Date();
  }
  next();
});

// Virtual for availability status
bookSchema.virtual("isAvailable").get(function () {
  return this.isActive && this.availableCopies > 0;
});

// Virtual for full location
bookSchema.virtual("fullLocation").get(function () {
  const { floor, section, shelf } = this.location;
  return [floor, section, shelf].filter(Boolean).join(" - ");
});

// Import the book ID generator
// Generate unique book ID before saving
bookSchema.pre<IBook>("save", async function (next) {
  if (this.isNew && !this.bookId) {
    try {
      this.bookId = await generateUniqueBookId();
    } catch (error) {
      return next(error as Error);
    }
  }
  next();
});

// Validate that bookId exists before saving
bookSchema.pre<IBook>("validate", async function (next) {
  if (this.isNew && !this.bookId) {
    try {
      this.bookId = await generateUniqueBookId();
    } catch (error) {
      return next(error as Error);
    }
  }
  next();
});

// Virtual for formatted book ID display
bookSchema.virtual("formattedBookId").get(function () {
  return this.bookId;
});

// Indexes for better performance
bookSchema.index({ bookId: 1 });
bookSchema.index({ title: "text", authors: "text", description: "text" });
bookSchema.index({ categories: 1 });
bookSchema.index({ tags: 1 });
bookSchema.index({ isActive: 1 });
bookSchema.index({ isFeatured: 1 });
bookSchema.index({ "statistics.views": -1 });
bookSchema.index({ "rating.average": -1 });
bookSchema.index({ createdAt: -1 });
bookSchema.index({ "metadata.addedBy": 1 });

const Book = mongoose.model<IBook>("Book", bookSchema);

export default Book;
