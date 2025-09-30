import { IComment } from "@models/interfaces/i-comment";
import { CommentModel } from "@models/schemas";
import { BaseRepository } from "./base-repository";
import { pipeline } from "stream";
import { lookup } from "dns";

class CommentRepository extends BaseRepository<IComment> {
  async getCommentsByTargetId(
    targetId: string,
    pagination: PaginationOptions = {}
  ) {
    await this.ensureConnection();
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;
    const sort: Record<string, 1 | -1> = {
      isPinned: 1,
      createdAt: -1,
      _id: -1,
    };
    const filter = { targetId, deletedAt: null, parentCommentId: null };
    const pipeline: any[] = [
      { $match: filter },
      { $sort: sort },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "users",
          localField: "authorId",
          foreignField: "_id",
          as: "author",
          pipeline: [
            {
              $project: {
                id: "$_id",
                email: 1,
                userName: 1,
                avatar: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "parentCommentId",
          as: "replies",
          pipeline: this.getRepliesPipeline(3),
        },
      },
      {
        $addFields: {
          id: "$_id",
          author: { $arrayElemAt: ["$author", 0] },
        },
      },
    ];
    const comments = await this.model.aggregate(pipeline).exec();
    const totalCount = await this.model
      .countDocuments({ targetId, deletedAt: null })
      .exec();

    return {
      comments,
      totalCount,
      limit,
      page,
    };
  }

  private getRepliesPipeline(depth: number = 3): any[] {
    if (depth === 0) return [];

    return [
      { $match: { deletedAt: null } },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "users",
          localField: "authorId",
          foreignField: "_id",
          as: "author",
          pipeline: [
            {
              $project: {
                id: "$_id",
                email: 1,
                userName: 1,
                avatar: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "parentCommentId",
          as: "replies",
          pipeline: this.getRepliesPipeline(depth - 1),
        },
      },
      {
        $addFields: {
          id: "$_id",
          author: { $arrayElemAt: ["$author", 0] },
        },
      },
    ];
  }
}

export default new CommentRepository(CommentModel);
