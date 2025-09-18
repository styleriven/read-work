import mongoose, { Schema } from "mongoose";
import { ICategory } from "../interfaces/i-category";
import { v4 } from "uuid";

const categorySchema = new Schema<ICategory>(
  {
    _id: {
      type: String,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
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
      maxlength: 200,
    },
    icon: String,
    color: {
      type: String,
      match: /^#[0-9A-Fa-f]{6}$/,
      default: "#1890ff",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    comicsCount: {
      type: Number,
      default: 0,
    },
    parentCategory: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
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

categorySchema.virtual("id").get(function () {
  return this._id;
});

const CategoryModel =
  (mongoose.models?.Category as mongoose.Model<ICategory>) ||
  mongoose.model<ICategory>("Category", categorySchema);

export default CategoryModel;
