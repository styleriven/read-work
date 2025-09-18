import mongoose, { Schema } from "mongoose";
import { IReadingHistory } from "../interfaces/i-reading-history";
import { v4 } from "uuid";

const readingHistorySchema = new Schema<IReadingHistory>(
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
      required: true,
    },
    page: {
      type: Number,
      default: 1,
    },
    readAt: {
      type: Date,
      default: new Date(),
    },
    readingTime: {
      type: Number,
      default: 0,
    },
    isCompleted: {
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

readingHistorySchema.virtual("id").get(function () {
  return this._id;
});

readingHistorySchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: true,
});

readingHistorySchema.virtual("comic", {
  ref: "Comic",
  localField: "comicId",
  foreignField: "_id",
  justOne: true,
});

readingHistorySchema.virtual("chapter", {
  ref: "Chapter",
  localField: "chapterId",
  foreignField: "_id",
  justOne: true,
});

const ReadingHistoryModel =
  (mongoose.models?.ReadingHistory as mongoose.Model<IReadingHistory>) ||
  mongoose.model<IReadingHistory>("ReadingHistory", readingHistorySchema);

export default ReadingHistoryModel;
