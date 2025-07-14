import mongoose, { Document, Schema } from "mongoose";

export interface IReaction extends Document {
  _id: string;
  user: mongoose.Types.ObjectId;
  book: mongoose.Types.ObjectId;
  type: "like" | "love" | "dislike" | "bookmark" | "favorite";
  createdAt: Date;
  updatedAt: Date;
}

const reactionSchema = new Schema<IReaction>(
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
    type: {
      type: String,
      enum: ["like", "love", "dislike", "bookmark", "favorite"],
      required: [true, "Reaction type is required"],
    },
  },
  {
    timestamps: true,
  }
);

// Ensure one reaction per user per book per type
reactionSchema.index({ user: 1, book: 1, type: 1 }, { unique: true });

// Additional indexes
reactionSchema.index({ book: 1, type: 1 });
reactionSchema.index({ user: 1, type: 1 });
reactionSchema.index({ createdAt: -1 });

const Reaction = mongoose.model<IReaction>("Reaction", reactionSchema);

export default Reaction;
