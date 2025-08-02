import mongoose, { Document, Schema } from "mongoose";
import slugify from "slugify";

export interface IAuthor extends Document {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  biography?: string;
  birthDate?: Date;
  deathDate?: Date;
  nationality?: string;
  photo?: string;
  website?: string;
  socialMedia?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
  genres?: string[];
  awards?: string[];
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

const authorSchema = new Schema<IAuthor>(
  {
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
        validator: function (v: string) {
          if (!v) return true;
          return /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/.test(
            v
          );
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

// Generate slug before saving
authorSchema.pre<IAuthor>("save", function (next) {
  if (this.isNew || this.isModified("name")) {
    this.slug = slugify(this.name, {
      lower: true,
      strict: true,
      remove: /[*+~.()'"!:@]/g,
    });
  }
  next();
});

// Update lastModifiedAt and lastModifiedBy on update
authorSchema.pre<IAuthor>("findOneAndUpdate", function (next) {
  this.set({ "metadata.lastModifiedAt": new Date() });
  next();
});

// Indexes for better performance
authorSchema.index({ name: 1 });
authorSchema.index({ slug: 1 });
authorSchema.index({ nationality: 1 });
authorSchema.index({ isActive: 1 });
authorSchema.index({ "metadata.addedAt": -1 });

export const Author = mongoose.model<IAuthor>("Author", authorSchema);
export default Author;
