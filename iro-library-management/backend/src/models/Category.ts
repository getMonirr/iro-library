import mongoose, { Document, Schema } from "mongoose";

export interface ICategory extends Document {
  name: string;
  description?: string;
  slug: string;
  isActive: boolean;
  metadata: {
    addedBy: mongoose.Types.ObjectId;
    lastModifiedBy: mongoose.Types.ObjectId;
    addedAt: Date;
    lastModifiedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      unique: true,
      maxlength: [100, "Category name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    metadata: {
      addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      lastModifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
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
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better performance
categorySchema.index({ name: 1 });
categorySchema.index({ slug: 1 });
categorySchema.index({ isActive: 1 });

// Virtual for books count
categorySchema.virtual("booksCount", {
  ref: "Book",
  localField: "name",
  foreignField: "categories",
  count: true,
});

// Pre-save middleware to generate slug
categorySchema.pre("save", function (this: ICategory, next) {
  if (this.isModified("name") || this.isNew) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single
      .trim();
  }
  next();
});

const Category = mongoose.model<ICategory>("Category", categorySchema);

export default Category;
