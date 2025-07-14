import mongoose, { Document, Schema } from "mongoose";

export interface IBorrow extends Document {
  _id: string;
  user: mongoose.Types.ObjectId;
  book: mongoose.Types.ObjectId;
  borrowDate: Date;
  dueDate: Date;
  returnDate?: Date;
  actualReturnDate?: Date;
  status: "active" | "returned" | "overdue" | "lost" | "damaged";
  renewalCount: number;
  renewalHistory: Array<{
    renewedDate: Date;
    previousDueDate: Date;
    newDueDate: Date;
    renewedBy: mongoose.Types.ObjectId;
    reason?: string;
  }>;
  fines: Array<{
    type: "late_return" | "damage" | "lost" | "other";
    amount: number;
    description: string;
    dateIssued: Date;
    datePaid?: Date;
    status: "pending" | "paid" | "waived";
    issuedBy: mongoose.Types.ObjectId;
    paidTo?: mongoose.Types.ObjectId;
  }>;
  notes: Array<{
    text: string;
    addedBy: mongoose.Types.ObjectId;
    addedAt: Date;
    type: "general" | "condition" | "reminder" | "warning";
  }>;
  remindersSent: Array<{
    type: "due_soon" | "overdue" | "final_notice";
    sentDate: Date;
    method: "email" | "sms" | "in_person";
  }>;
  issuedBy: mongoose.Types.ObjectId;
  returnedTo?: mongoose.Types.ObjectId;
  digitalAccess?: {
    accessGranted: boolean;
    accessExpiry: Date;
    downloadCount: number;
    maxDownloads: number;
    ipRestrictions?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const borrowSchema = new Schema<IBorrow>(
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
          type: Schema.Types.ObjectId,
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
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        paidTo: {
          type: Schema.Types.ObjectId,
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
          type: Schema.Types.ObjectId,
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
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    returnedTo: {
      type: Schema.Types.ObjectId,
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
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for days borrowed
borrowSchema.virtual("daysBorrowed").get(function () {
  const endDate = this.actualReturnDate || new Date();
  const startDate = this.borrowDate;
  return Math.ceil(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
});

// Virtual for days overdue
borrowSchema.virtual("daysOverdue").get(function () {
  if (this.status !== "overdue" && this.status !== "active") return 0;
  const today = new Date();
  const dueDate = this.dueDate;
  if (today <= dueDate) return 0;
  return Math.ceil(
    (today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)
  );
});

// Virtual for total fines
borrowSchema.virtual("totalFines").get(function () {
  return this.fines
    .filter((fine: any) => fine.status === "pending")
    .reduce((total: number, fine: any) => total + fine.amount, 0);
});

// Check if overdue and update status
borrowSchema.pre("save", function (next) {
  if (this.status === "active" && new Date() > this.dueDate) {
    this.status = "overdue";
  }
  next();
});

// Ensure due date is after borrow date
borrowSchema.pre("validate", function (next) {
  if (this.dueDate <= this.borrowDate) {
    next(new Error("Due date must be after borrow date"));
  } else {
    next();
  }
});

// Compound indexes for better query performance
borrowSchema.index({ user: 1, status: 1 });
borrowSchema.index({ book: 1, status: 1 });
borrowSchema.index({ status: 1, dueDate: 1 });
borrowSchema.index({ borrowDate: -1 });
borrowSchema.index({ dueDate: 1 });
borrowSchema.index({ user: 1, book: 1, borrowDate: -1 });

const Borrow = mongoose.model<IBorrow>("Borrow", borrowSchema);

export default Borrow;
