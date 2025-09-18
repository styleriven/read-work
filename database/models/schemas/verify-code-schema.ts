import IVerifyCode from "@models/interfaces/i-verify-code";
import mongoose, { Schema } from "mongoose";

const verifyCodeSchema = new Schema<IVerifyCode>(
  {
    _id: {
      type: String,
    },
    userId: { type: String, required: true },
    code: { type: String, required: true },
    type: {
      type: String,
      enum: ["verifyEmail", "resetPassword"],
      required: true,
    },
    expiredAt: { type: Date, required: true },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

verifyCodeSchema.virtual("id").get(function () {
  return this._id;
});

verifyCodeSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: false,
});

const VerifyCodeModel =
  (mongoose.models?.VerifyCode as mongoose.Model<IVerifyCode>) ||
  mongoose.model<IVerifyCode>("VerifyCode", verifyCodeSchema);

export default VerifyCodeModel;
