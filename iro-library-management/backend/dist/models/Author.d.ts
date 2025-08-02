import mongoose, { Document } from "mongoose";
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
export declare const Author: mongoose.Model<IAuthor, {}, {}, {}, mongoose.Document<unknown, {}, IAuthor, {}> & IAuthor & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
export default Author;
//# sourceMappingURL=Author.d.ts.map