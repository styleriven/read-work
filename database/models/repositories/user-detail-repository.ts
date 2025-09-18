import { IUserDetail } from "@models/interfaces/i-user-detail";
import { BaseRepository } from "./base-repository";
import { UserDetailModel } from "../schemas";

class UserDetailRepository extends BaseRepository<IUserDetail> {}

export default new UserDetailRepository(UserDetailModel);
