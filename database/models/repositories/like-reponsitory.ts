import { ILike } from "@models/interfaces/i-like";
import { LikeModel } from "@models/schemas";
import { BaseRepository } from "./base-repository";

class LikeRepository extends BaseRepository<ILike> {}
export default new LikeRepository(LikeModel);
