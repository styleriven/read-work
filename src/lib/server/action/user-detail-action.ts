import { IUserDetail } from "@models/interfaces/i-user-detail";
import userDetailRepository from "@models/repositories/user-detail-repository";

class UserDetailAction {
  async createUser(userData: Partial<IUserDetail>): Promise<IUserDetail> {
    try {
      const newUser = await userDetailRepository.create(userData);
      return newUser;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }
}

export default new UserDetailAction();
