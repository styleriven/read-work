import { REQUEST_URLS_V1 } from "@/config/request-urls";
import { $fetch, $globalFetch } from "@/lib/axios";

export class CommentQuery {
  static async getCommentsByTargetId(
    targetId: string,
    page: number,
    limit: number
  ): Promise<any> {
    const response = await $globalFetch.get(
      `${REQUEST_URLS_V1.COMMENT}?targetId=${targetId}&page=${page}&limit=${limit}`
    );
    return response.data;
  }

  static async createComment(data: {
    targetId: string;
    targetType: string;
    comicId: string;
    authorId: string;
    content: string;
    parentCommentId?: string;
  }): Promise<any> {
    const response = await $fetch.post(REQUEST_URLS_V1.COMMENT, data);
    return response.data;
  }
}
