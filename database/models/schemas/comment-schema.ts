import mongoose, { Schema } from "mongoose";
import { IComment } from "../interfaces/i-comment";
import { v4 } from "uuid";

const commentSchema = new Schema<IComment>(
  {
    _id: {
      type: String,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    authorId: {
      type: String,
      ref: "User",
      required: true,
    },
    targetType: {
      type: String,
      enum: ["Comic", "Chapter"],
      required: true,
    },
    targetId: {
      type: String,
      required: true,
      refPath: function () {
        return this.targetType;
      },
    },
    parentCommentId: {
      type: String,
      ref: "Comment",
      default: null,
    },
    replyToUserId: {
      type: String,
      ref: "User",
      default: null,
    },
    level: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    isEdited: {
      type: Boolean,
      default: false,
    },

    editedAt: Date,
    stats: {
      likesCount: { type: Number, default: 0 },
      repliesCount: { type: Number, default: 0 },
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    isReported: {
      type: Boolean,
      default: false,
    },
    reportCount: {
      type: Number,
      default: 0,
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

commentSchema.virtual("id").get(function () {
  return this._id;
});

commentSchema.virtual("replies", {
  ref: "Comment",
  localField: "_id",
  foreignField: "parentCommentId",
});

commentSchema.virtual("author", {
  ref: "User",
  localField: "authorId",
  foreignField: "_id",
  justOne: true,
});

commentSchema.virtual("target", {
  refPath: function () {
    return this.targetType;
  },
  localField: "targetId",
  foreignField: "_id",
  justOne: true,
});

commentSchema.virtual("replyToUser", {
  ref: "User",
  localField: "replyToUserId",
  foreignField: "_id",
  justOne: true,
});

const CommentModel =
  (mongoose.models?.Comment as mongoose.Model<IComment>) ||
  mongoose.model<IComment>("Comment", commentSchema);

export default CommentModel;
