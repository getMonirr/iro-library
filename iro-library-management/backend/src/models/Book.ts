import mongoose, { Document, Schema } from "mongoose";

export interface IBook extends Document {
  _id: string;
  title: string;
  subtitle?: string;
  authors: string[];
  isbn?: string;
  isbn13?: string;
  publisher?: string;
  publishedDate?: Date;
  language: string;
  pages?: number;
  description?: string;
  categories: string[];
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
        validator: function (v: string) {
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
        validator: function (v: string) {
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

// Indexes for better query performance
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

const Book = mongoose.model<IBook>("Book", bookSchema);

export default Book;
