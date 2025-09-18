import mongoose, { Schema } from "mongoose";
import { IFollow } from "../interfaces/i-follow";
import { v4 } from "uuid";

const followSchema = new Schema<IFollow>(
  {
    _id: {
      type: String,
    },
    followerId: {
      type: String,
      ref: "User",
      required: true,
    },
    followingId: {
      type: String,
      ref: "User",
      required: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

followSchema.virtual("id").get(function () {
  return this._id;
});

followSchema.virtual("followingUser", {
  ref: "User",
  localField: "followingId",
  foreignField: "_id",
  justOne: true,
});

// Lấy thông tin user follower
followSchema.virtual("followerUser", {
  ref: "User",
  localField: "followerId",
  foreignField: "_id",
  justOne: true,
});

const FollowModel =
  (mongoose.models?.Follow as mongoose.Model<IFollow>) ||
  mongoose.model<IFollow>("Follow", followSchema);

export default FollowModel;
