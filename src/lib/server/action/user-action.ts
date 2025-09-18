import { IUser } from "@models/interfaces/i-user";
import userRepository from "@models/repositories/user-repository";
class UserAction {
  async getUserByEmail(
    email: string,
    isVerified?: boolean
  ): Promise<IUser | null> {
    try {
      return await userRepository.getUserByEmail(email, isVerified);
    } catch (error) {
      console.error("Error fetching user by email:", error);
      throw error;
    }
  }

  async createUser(userData: Partial<IUser>): Promise<IUser> {
    try {
      const newUser = await userRepository.create(userData);
      return newUser;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async getUserById(id: string): Promise<IUser | null> {
    try {
      return await userRepository.findById(id);
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      throw error;
    }
  }

  async update(id: string, updateData: Partial<IUser>): Promise<IUser | null> {
    try {
      const updatedUser = await userRepository.update(id, updateData);
      return updatedUser;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  async getFullUser(id: string): Promise<IUser | null> {
    try {
      return await userRepository.getFullUser(id);
    } catch (error) {
      console.error("Error fetching full user:", error);
      throw error;
    }
  }

  async updateUser(userId: string, updateData: Partial<IUser>) {
    try {
      const updatedUser = await userRepository.update(userId, updateData);
      return updatedUser;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }
}

export default new UserAction();
