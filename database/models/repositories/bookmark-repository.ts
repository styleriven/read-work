import { IBookmark } from "@models/interfaces/i-bookmark";
import { BookmarkModel } from "@models/schemas";
import { BaseRepository } from "./base-repository";

class BookmarkRepository extends BaseRepository<IBookmark> {
  async createOrUpdate(data: Partial<IBookmark>) {
    await this.ensureConnection();
    const filter = { userId: data.userId, comicId: data.comicId };
    const update = { ...data, userId: data.userId };
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };
    const bookmark = await this.model.findOneAndUpdate(filter, update, options);
    return bookmark;
  }

  async getBookmarksByUserId(
    userId: string,
    pagination: PaginationOptions = {}
  ) {
    await this.ensureConnection();
    const { page = 1, limit = 10 } = pagination;
    const bookmarks = await this.model
      .find({ userId })
      .skip((page - 1) * limit)
      .limit(limit);
    return bookmarks;
  }

  async getByUserIdAndComicId(data: Partial<IBookmark>) {
    await this.ensureConnection();
    const filter = { userId: data.userId, comicId: data.comicId };
    const bookmark = await this.model
      .findOne(filter)
      .populate("chapter", "id slug")
      .exec();

    return bookmark;
  }
}
export default new BookmarkRepository(BookmarkModel);
