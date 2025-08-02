import mongoose, { Document } from "mongoose";
export interface IBook extends Document {
    _id: string;
    bookId: string;
    title: string;
    subtitle?: string;
    authors: mongoose.Types.ObjectId[];
    publisher?: mongoose.Types.ObjectId;
    publishedDate?: Date;
    language: string;
    pages?: number;
    description?: string;
    categories: mongoose.Types.ObjectId[];
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
declare const Book: mongoose.Model<IBook, {}, {}, {}, mongoose.Document<unknown, {}, IBook, {}> & IBook & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
export default Book;
//# sourceMappingURL=Book.d.ts.map