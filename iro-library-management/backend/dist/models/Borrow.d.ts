import mongoose, { Document } from "mongoose";
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
declare const Borrow: mongoose.Model<IBorrow, {}, {}, {}, mongoose.Document<unknown, {}, IBorrow, {}> & IBorrow & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
export default Borrow;
//# sourceMappingURL=Borrow.d.ts.map