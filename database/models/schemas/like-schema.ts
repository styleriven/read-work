import mongoose, { Schema } from "mongoose";
import { ILike } from "../interfaces/i-like";
import { v4 } from "uuid";
import { ref } from "process";

const likeSchema = new Schema<ILike>(
  {
    _id: {
      type: String,
    },
    userId: {
      type: String,
      ref: "User",
      required: true,
    },
    targetType: {
      type: String,
      enum: ["Comic", "Chapter", "Comment"],
      required: true,
    },
    targetId: {
      type: String,
      required: true,
      refPath: function () {
        return this.targetType;
      },
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

likeSchema.virtual("id").get(function () {
  return this._id;
});

likeSchema.virtual("target", {
  refPath: function () {
    return this.targetType;
  },
  localField: "targetId",
  foreignField: "_id",
  justOne: true,
});

const LikeModel =
  (mongoose.models?.Like as mongoose.Model<ILike>) ||
  mongoose.model<ILike>("Like", likeSchema);

export default LikeModel;
