import mongoose, { Schema } from "mongoose";
import { IUser } from "../interfaces/i-user";
const userSchema = new Schema<IUser>(
  {
    _id: {
      type: String,
    },
    userName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: { type: String, minlength: 6 },
    avatar: { type: String, default: "/default-avatar.png" },
    displayName: { type: String, trim: true, maxlength: 50 },
    bio: { type: String, maxlength: 500 },
    role: { type: Number, enum: [1, 2, 3], default: 3 },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    accountCreatedAt: { type: Date, default: new Date() },
    lastLoginAt: { type: Date, default: null },
    socialProviders: { google: String, facebook: String },
    preferences: {
      theme: {
        type: String,
        enum: ["light", "dark", "auto"],
        default: "light",
      },
      readingMode: {
        type: String,
        enum: ["single", "double", "webtoon"],
        default: "single",
      },
      autoNext: { type: Boolean, default: true },
      emailNotifications: { type: Boolean, default: true },
    },
    stats: {
      comicsCount: { type: Number, default: 0 },
      followersCount: { type: Number, default: 0 },
      followingCount: { type: Number, default: 0 },
      commentsCount: { type: Number, default: 0 },
      likesReceived: { type: Number, default: 0 },
    },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

userSchema.virtual("id").get(function () {
  return this._id;
});

userSchema.virtual("tokens", {
  ref: "Token",
  localField: "_id",
  foreignField: "userId",
});

userSchema.virtual("followers", {
  ref: "Follow",
  localField: "_id",
  foreignField: "followerId",
});

userSchema.virtual("followings", {
  ref: "Follow",
  localField: "_id",
  foreignField: "followingId",
});

userSchema.virtual("bookmarks", {
  ref: "Bookmark",
  localField: "_id",
  foreignField: "userId",
});

userSchema.virtual("ratings", {
  ref: "Rating",
  localField: "_id",
  foreignField: "userId",
});

userSchema.virtual("readingHistory", {
  ref: "ReadingHistory",
  localField: "_id",
  foreignField: "userId",
});

userSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "authorId",
});

userSchema.virtual("replyComments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "replyToUserId",
});

userSchema.virtual("likes", {
  ref: "Like",
  localField: "_id",
  foreignField: "targetId",
});

userSchema.virtual("verify", {
  ref: "VerifyCode",
  localField: "_id",
  foreignField: "userId",
});

userSchema.virtual("detail", {
  ref: "UserDetail",
  localField: "_id",
  foreignField: "userId",
  justOne: true,
});

const UserModel =
  (mongoose.models?.User as mongoose.Model<IUser>) ||
  mongoose.model<IUser>("User", userSchema);

export default UserModel;
