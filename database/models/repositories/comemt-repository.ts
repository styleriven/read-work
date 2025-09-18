import { IComment } from "@models/interfaces/i-comment";
import { CommentModel } from "@models/schemas";
import { BaseRepository } from "./base-repository";

class CommentRepository extends BaseRepository<IComment> {}
export default new CommentRepository(CommentModel);
