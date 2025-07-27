import mongoose, { Document } from "mongoose";
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
    category: "auth" | "user_management" | "book_management" | "borrowing" | "system" | "security";
}
declare const ActivityLog: mongoose.Model<IActivityLog, {}, {}, {}, mongoose.Document<unknown, {}, IActivityLog, {}> & IActivityLog & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
export default ActivityLog;
//# sourceMappingURL=ActivityLog.d.ts.map