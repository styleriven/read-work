import mongoose, { Schema } from "mongoose";
import { IComicCollection } from "../interfaces/i-comic-collection";
import { v4 } from "uuid";

const comicCollectionSchema = new Schema<IComicCollection>(
  {
    _id: {
      type: String,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    coverImage: String,
    userId: {
      type: String,
      ref: "User",
      required: true,
    },
    comicIds: [
      {
        type: String,
        ref: "Comic",
      },
    ],
    isPublic: {
      type: Boolean,
      default: true,
    },
    tags: [
      {
        type: String,
        trim: true,
        maxlength: 30,
      },
    ],
    stats: {
      comicsCount: { type: Number, default: 0 },
      followersCount: { type: Number, default: 0 },
      viewsCount: { type: Number, default: 0 },
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

comicCollectionSchema.virtual("id").get(function () {
  return this._id;
});

comicCollectionSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: true,
});

// Lấy danh sách comic trong collection
comicCollectionSchema.virtual("comics", {
  ref: "Comic",
  localField: "comicIds",
  foreignField: "_id",
  justOne: false,
});

const ComicCollectionModel =
  (mongoose.models?.ComicCollection as mongoose.Model<IComicCollection>) ||
  mongoose.model<IComicCollection>("ComicCollection", comicCollectionSchema);

export default ComicCollectionModel;
