import mongoose, { Schema } from "mongoose";
import { IComic } from "../interfaces/i-comic";
import { select } from "framer-motion/dist/m";

const comicSchema = new Schema<IComic>(
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
    description: {
      type: String,
      required: true,
      maxlength: 5000,
    },
    coverImage: String,
    authorId: {
      type: [String],
      ref: "User",
      required: true,
    },
    authorName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    artist: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    categoryId: {
      type: [String],
      ref: "Category",
      required: true,
    },
    type: [
      {
        type: String,
        trim: true,
        maxlength: 30,
      },
    ],
    status: {
      type: String,
      enum: ["draft", "ongoing", "completed", "hiatus", "cancelled"],
      default: "draft",
    },
    visibility: {
      type: String,
      enum: ["public", "private", "unlisted"],
      default: "public",
    },
    isOriginal: {
      type: Boolean,
      default: true,
    },
    language: {
      type: String,
      default: "vi",
    },
    originalLanguage: {
      type: String,
      default: null,
    },
    publicationYear: {
      type: Number,
      min: 1900,
      max: new Date().getFullYear() + 1,
    },
    ageRating: {
      type: String,
      enum: ["all-ages", "teen", "mature", "adult"],
      default: "all-ages",
    },
    warnings: [
      {
        type: String,
        enum: [
          "violence",
          "sexual-content",
          "strong-language",
          "disturbing-content",
          "death",
          "gore",
        ],
      },
    ],
    comicType: {
      type: String,
      enum: ["manga", "manhwa", "manhua", "webtoon", "comic"],
      default: "manga",
    },
    readingDirection: {
      type: String,
      enum: ["left-to-right", "right-to-left", "top-to-bottom"],
      default: "right-to-left",
    },
    stats: {
      viewsCount: { type: Number, default: 0 },
      likesCount: { type: Number, default: 0 },
      bookmarksCount: { type: Number, default: 0 },
      commentsCount: { type: Number, default: 0 },
      chaptersCount: { type: Number, default: 0 },
      avgRating: { type: Number, default: 0 },
      ratingCount: { type: Number, default: 0 },
    },
    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String],
    },
    publishedAt: Date,
    lastChapterAt: Date,
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

comicSchema.virtual("id").get(function () {
  return this._id;
});

comicSchema.virtual("chapters", {
  ref: "Chapter",
  localField: "_id",
  foreignField: "comicId",
  justOne: false,
  match: { deletedAt: null },
});

comicSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "targetId",
  justOne: false,
  match: { targetType: "comic", deletedAt: null },
});

// comicSchema.virtual("bookmarks", {
//   ref: "Bookmark",
//   localField: "_id",
//   foreignField: "comicId",
//   justOne: false,
//   match: { deletedAt: null },
// });

comicSchema.virtual("collections", {
  ref: "ComicCollection",
  localField: "_id",
  foreignField: "comicIds",
  justOne: false,
  match: { deletedAt: null },
});

comicSchema.virtual("author", {
  ref: "User",
  localField: "authorId",
  foreignField: "_id",
});

comicSchema.virtual("categories", {
  ref: "Category",
  localField: "categoryId",
  foreignField: "_id",
  justOne: false,
});

const ComicModel =
  (mongoose.models?.Comic as mongoose.Model<IComic>) ||
  mongoose.model<IComic>("Comic", comicSchema);

export default ComicModel;
