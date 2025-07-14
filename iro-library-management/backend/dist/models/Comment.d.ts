import mongoose, { Document } from "mongoose";
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
declare const Comment: mongoose.Model<IComment, {}, {}, {}, mongoose.Document<unknown, {}, IComment, {}> & IComment & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
export default Comment;
//# sourceMappingURL=Comment.d.ts.map