import { IComment } from "@models/interfaces/i-comment";
import commentRepository from "@models/repositories/comment-repository";
import console from "console";

export class CommentAction {
  static async getCommentsByTargetId(
    targetId: string,
    page?: number,
    limit?: number
  ): Promise<any> {
    try {
      const data = await commentRepository.getCommentsByTargetId(targetId, {
        page,
        limit,
      });
      return data;
    } catch (error) {
      console.error("Error fetching comments by target ID:", error);
      throw error;
    }
  }

  static async createComment(data: Partial<IComment>): Promise<IComment> {
    try {
      const newComment = await commentRepository.create(data);
      return newComment;
    } catch (error) {
      throw error;
    }
  }
}
