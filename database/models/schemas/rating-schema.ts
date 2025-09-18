import mongoose, { Schema } from "mongoose";
import { IRating } from "../interfaces/i-rating";
import { v4 } from "uuid";

const ratingSchema = new Schema<IRating>(
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
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      maxlength: 1000,
    },
    isPublic: {
      type: Boolean,
      default: true,
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

ratingSchema.virtual("id").get(function () {
  return this._id;
});

ratingSchema.virtual("user", {
  ref: "User",
  localField: "userId",
  foreignField: "_id",
  justOne: true,
});

ratingSchema.virtual("comic", {
  ref: "Comic",
  localField: "comicId",
  foreignField: "_id",
  justOne: true,
});

const RatingModel =
  (mongoose.models?.Rating as mongoose.Model<IRating>) ||
  mongoose.model<IRating>("Rating", ratingSchema);

export default RatingModel;
