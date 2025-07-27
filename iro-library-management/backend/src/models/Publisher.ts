import mongoose, { Document, Schema } from "mongoose";

export interface IPublisher extends Document {
  name: string;
  description?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  establishedYear?: number;
  logo?: string;
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

const publisherSchema = new Schema<IPublisher>(
  {
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
        validator: function (v: string) {
          if (!v) return true; // Allow empty values
          return /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/.test(
            v
          );
        },
        message: "Please provide a valid website URL",
      },
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v: string) {
          if (!v) return true; // Allow empty values
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
publisherSchema.index({ name: 1 });
publisherSchema.index({ isActive: 1 });
publisherSchema.index({ "address.country": 1 });

// Virtual for books count
publisherSchema.virtual("booksCount", {
  ref: "Book",
  localField: "name",
  foreignField: "publisher",
  count: true,
});

const Publisher = mongoose.model<IPublisher>("Publisher", publisherSchema);

export default Publisher;
