import mongoose, { Document, Schema } from "mongoose";

export interface IComment extends Document {
  _id: string;
  user: mongoose.Types.ObjectId;
  book: mongoose.Types.ObjectId;
  parentComment?: mongoose.Types.ObjectId;
  content: string;
  isEdited: boolean;
  editHistory: Array<{
    content: string;
    editedAt: Date;
  }>;
  likes: number;
  replies: mongoose.Types.ObjectId[];
  isReported: boolean;
  reportReasons: Array<{
    reason: string;
    reportedBy: mongoose.Types.ObjectId;
    reportedAt: Date;
    status: "pending" | "reviewed" | "resolved" | "dismissed";
  }>;
  isModerated: boolean;
  moderatedBy?: mongoose.Types.ObjectId;
  moderatedAt?: Date;
  moderationReason?: string;
  isHidden: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    book: {
      type: Schema.Types.ObjectId,
      ref: "Book",
      required: [true, "Book is required"],
    },
    parentComment: {
      type: Schema.Types.ObjectId,
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
        type: Schema.Types.ObjectId,
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
          type: Schema.Types.ObjectId,
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
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    moderatedAt: Date,
    moderationReason: String,
    isHidden: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for reply count
commentSchema.virtual("replyCount").get(function () {
  return this.replies.length;
});

// Pre-save middleware to track edits
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

// Indexes
commentSchema.index({ book: 1, createdAt: -1 });
commentSchema.index({ user: 1, createdAt: -1 });
commentSchema.index({ parentComment: 1 });
commentSchema.index({ isReported: 1 });
commentSchema.index({ isModerated: 1 });
commentSchema.index({ isHidden: 1 });

const Comment = mongoose.model<IComment>("Comment", commentSchema);

export default Comment;
