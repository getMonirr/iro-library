import mongoose, { Document } from "mongoose";
export interface IReaction extends Document {
    _id: string;
    user: mongoose.Types.ObjectId;
    book: mongoose.Types.ObjectId;
    type: "like" | "love" | "dislike" | "bookmark" | "favorite";
    createdAt: Date;
    updatedAt: Date;
}
declare const Reaction: mongoose.Model<IReaction, {}, {}, {}, mongoose.Document<unknown, {}, IReaction, {}> & IReaction & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
export default Reaction;
//# sourceMappingURL=Reaction.d.ts.map