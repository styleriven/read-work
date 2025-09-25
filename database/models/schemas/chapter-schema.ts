import mongoose, { Schema } from "mongoose";
import { IChapter } from "../interfaces/i-chapter";
import { v4 } from "uuid";

const chapterSchema = new Schema<IChapter>(
  {
    _id: {
      type: String,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: /^[a-z0-9-]+$/,
    },
    comicId: {
      type: String,
      ref: "Comic",
      required: true,
    },
    chapterNumber: {
      type: Number,
      required: true,
    },
    content: {
      type: String,
      default: "",
    },
    volumeNumber: {
      type: Number,
      default: null,
    },
    authorId: {
      type: [String],
      ref: "User",
      required: true,
    },
    pages: [
      {
        imageUrl: {
          type: String,
          required: true,
        },
        pageNumber: {
          type: Number,
          required: true,
        },
        width: Number,
        height: Number,
      },
    ],
    isPremium: {
      type: Boolean,
      default: false,
    },
    authorNote: {
      type: String,
      maxlength: 1000,
    },
    translatorNote: {
      type: String,
      maxlength: 1000,
    },
    stats: {
      viewsCount: { type: Number, default: 0 },
      likesCount: { type: Number, default: 0 },
      commentsCount: { type: Number, default: 0 },
    },
    publishedAt: Date,
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

chapterSchema.virtual("id").get(function () {
  return this._id;
});

chapterSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "targetId",
  justOne: false,
  match: { targetType: "chapter", deletedAt: null },
});

chapterSchema.virtual("bookmarks", {
  ref: "Bookmark",
  localField: "_id",
  foreignField: "chapterId",
  justOne: false,
  match: { deletedAt: null },
});

chapterSchema.virtual("readingHistories", {
  ref: "ReadingHistory",
  localField: "_id",
  foreignField: "chapterId",
  justOne: false,
  match: { deletedAt: null },
});

chapterSchema.virtual("comic", {
  ref: "Comic",
  localField: "comicId",
  foreignField: "_id",
  justOne: true,
});

chapterSchema.virtual("author", {
  ref: "User",
  localField: "authorId",
  foreignField: "_id",
});

chapterSchema.index({
  comicId: 1,
  deletedAt: 1,
  publishedAt: 1,
});

const ChapterModel =
  (mongoose.models?.Chapter as mongoose.Model<IChapter>) ||
  mongoose.model<IChapter>("Chapter", chapterSchema);

export default ChapterModel;
