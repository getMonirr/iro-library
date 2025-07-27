import mongoose, { Document } from "mongoose";
export interface IPublisher extends Document {
    name: string;
    description?: string;
    website?: string;
    email?: string;
    phone?: string;
    address?: {
        street?: string;
        city?: string;
        state?: string;
        country?: string;
        zipCode?: string;
    };
    establishedYear?: number;
    logo?: string;
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
declare const Publisher: mongoose.Model<IPublisher, {}, {}, {}, mongoose.Document<unknown, {}, IPublisher, {}> & IPublisher & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default Publisher;
//# sourceMappingURL=Publisher.d.ts.map