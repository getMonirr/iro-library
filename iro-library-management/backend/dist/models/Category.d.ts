import mongoose, { Document } from "mongoose";
export interface ICategory extends Document {
    name: string;
    description?: string;
    slug: string;
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
declare const Category: mongoose.Model<ICategory, {}, {}, {}, mongoose.Document<unknown, {}, ICategory, {}> & ICategory & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Category;
//# sourceMappingURL=Category.d.ts.map