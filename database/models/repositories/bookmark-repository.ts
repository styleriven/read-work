import { IBookmark } from "@models/interfaces/i-bookmark";
import { BookmarkModel } from "@models/schemas";
import { BaseRepository } from "./base-repository";

class BookmarkRepository extends BaseRepository<IBookmark> {}
export default new BookmarkRepository(BookmarkModel);
