import { IUserDetail } from "@models/interfaces/i-user-detail";
import mongoose, { Schema } from "mongoose";

const userDetailSchema = new Schema<IUserDetail>(
  {
    _id: {
      type: String,
    },
    userId: {
      type: String,
      ref: "User",
      required: true,
      unique: true,
    },
    referral: { type: [String], default: [] },
    metallic: { type: Number, default: 0 },
    ruby: { type: Number, default: 0 },
    tickets: { type: Number, default: 0 },
    svipPoints: { type: Number, default: 0 },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userDetailSchema.virtual("id").get(function () {
  return this._id;
});

const UserDetailModel =
  (mongoose.models?.UserDetail as mongoose.Model<IUserDetail>) ||
  mongoose.model<IUserDetail>("UserDetail", userDetailSchema);

export default UserDetailModel;
