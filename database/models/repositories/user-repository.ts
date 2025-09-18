import { UserModel } from "@models/schemas";
import { IUser } from "../interfaces/i-user";
import { BaseRepository } from "./base-repository";

class UserRepository extends BaseRepository<IUser> {
  async getUserByEmail(
    email: string,
    isVerified?: boolean
  ): Promise<IUser | null> {
    await this.ensureConnection();
    if (isVerified === undefined) {
      return await this.model.findOne({ email }).exec();
    }
    return await this.model.findOne({ email, isVerified }).exec();
  }

  async getFullUser(_id: string): Promise<IUser | null> {
    await this.ensureConnection();
    return await this.model.findOne({ _id }).populate("detail").exec();
  }
}

export default new UserRepository(UserModel);
