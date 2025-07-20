import mongoose, { Document, Schema } from "mongoose";

export interface IActivityLog extends Document {
  _id: string;
  user: mongoose.Types.ObjectId;
  action: string;
  resource: string;
  resourceId?: string;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
  severity: "low" | "medium" | "high" | "critical";
  category:
    | "auth"
    | "user_management"
    | "book_management"
    | "borrowing"
    | "system"
    | "security";
}

const activityLogSchema = new Schema<IActivityLog>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
      maxlength: 100,
    },
    resource: {
      type: String,
      required: true,
      maxlength: 50,
    },
    resourceId: {
      type: String,
      maxlength: 100,
    },
    details: {
      type: Schema.Types.Mixed,
      default: {},
    },
    ipAddress: {
      type: String,
      maxlength: 45, // IPv6 max length
    },
    userAgent: {
      type: String,
      maxlength: 500,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    severity: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "low",
    },
    category: {
      type: String,
      enum: [
        "auth",
        "user_management",
        "book_management",
        "borrowing",
        "system",
        "security",
      ],
      required: true,
    },
  },
  {
    timestamps: false, // We're using our own timestamp field
    collection: "activity_logs",
  }
);

// Indexes for better query performance
activityLogSchema.index({ user: 1, timestamp: -1 });
activityLogSchema.index({ category: 1, timestamp: -1 });
activityLogSchema.index({ severity: 1, timestamp: -1 });
activityLogSchema.index({ resource: 1, timestamp: -1 });
activityLogSchema.index({ timestamp: -1 });

// TTL index to automatically delete logs older than 1 year
activityLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 31536000 }); // 365 days

const ActivityLog = mongoose.model<IActivityLog>(
  "ActivityLog",
  activityLogSchema
);

export default ActivityLog;
