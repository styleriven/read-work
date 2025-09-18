import mongoose, { Schema } from "mongoose";
import { IToken } from "../interfaces/i-token";
import { v4 } from "uuid";

const tokenSchema = new Schema<IToken>(
  {
    _id: {
      type: String,
    },
    userId: {
      type: String,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["access", "refresh", "resetPassword", "verifyEmail"],
    },
    blacklisted: {
      type: Boolean,
      default: false,
    },

    expiresAt: {
      type: Date,
      required: true,
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

tokenSchema.virtual("id").get(function () {
  return this._id;
});
tokenSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: true,
});

const TokenModel =
  (mongoose.models?.Token as mongoose.Model<IToken>) ||
  mongoose.model<IToken>("Token", tokenSchema);

export default TokenModel;
