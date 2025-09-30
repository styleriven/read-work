import bookmarkRepository from "@models/repositories/bookmark-repository";
import { HttpStatusCode } from "axios";
import { ApiError } from "next/dist/server/api-utils";

class BookmarkAction {
  async getByUserIdAndComicId(userId: string, comicId: string) {
    try {
      const bookmark = await bookmarkRepository.getByUserIdAndComicId({
        userId,
        comicId,
      });
      if (!bookmark) {
        throw new ApiError(HttpStatusCode.NotFound, "Bookmark not found");
      }
      return bookmark;
    } catch (error) {
      console.error("Error fetching bookmark:", error);
      throw error;
    }
  }
}

export default new BookmarkAction();
