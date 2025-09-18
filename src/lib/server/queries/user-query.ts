import { REQUEST_URLS_V1 } from "@/config/request-urls";
import { $fetch } from "@/lib/axios";
import { IUser } from "@/types/user";

export class UserQuery {
  static async getFullUser(id: string): Promise<IUser | null> {
    const response = await $fetch.get(`${REQUEST_URLS_V1.USER}/${id}`);

    if (response.status === 200) {
      return response.data;
    }
    return null;
  }

  static async updateUser({
    user_name,
    avatar,
    bio,
    preferences,
    display_name,
  }: {
    user_name?: string;
    avatar?: string;
    bio?: string;
    preferences?: any;
    display_name?: string;
  }) {
    const response = await $fetch.patch(REQUEST_URLS_V1.USER, {
      user_name,
      avatar,
      bio,
      preferences,
      display_name,
    });
    if (response.status === 200) {
      return response.data;
    }
    return null;
  }
}
