import mongoose, { Schema } from "mongoose";
import { IBookmark } from "../interfaces/i-bookmark";

const bookmarkSchema = new Schema<IBookmark>(
  {
    _id: {
      type: String,
    },
    userId: {
      type: String,
      ref: "User",
      required: true,
    },
    comicId: {
      type: String,
      ref: "Comic",
      required: true,
    },
    chapterId: {
      type: String,
      ref: "Chapter",
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    readingProgress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    notes: {
      type: String,
      maxlength: 500,
    },
    isPrivate: {
      type: Boolean,
      default: false,
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

bookmarkSchema.virtual("id").get(function () {
  return this._id;
});

bookmarkSchema.virtual("comic", {
  ref: "Comic",
  localField: "comicId",
  foreignField: "_id",
  justOne: true,
});

bookmarkSchema.virtual("chapter", {
  ref: "Chapter",
  localField: "chapterId",
  foreignField: "_id",
  justOne: true,
});

bookmarkSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: true,
});

const BookmarkModel =
  (mongoose.models?.Bookmark as mongoose.Model<IBookmark>) ||
  mongoose.model<IBookmark>("Bookmark", bookmarkSchema);

export default BookmarkModel;
