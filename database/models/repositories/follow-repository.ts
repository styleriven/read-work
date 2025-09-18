import { IFollow } from "@models/interfaces/i-follow";
import { FollowModel } from "@models/schemas";
import { BaseRepository } from "./base-repository";

class FollowRepository extends BaseRepository<IFollow> {}
export default new FollowRepository(FollowModel);
