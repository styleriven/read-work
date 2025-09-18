import { REQUEST_URLS_V1 } from "@/config/request-urls";
import { $globalFetch } from "@/lib/axios";
import { ICategory } from "@models/interfaces/i-category";

export class CategoryQuery {
  static async getAll(): Promise<ICategory[] | []> {
    const response = await $globalFetch.get(REQUEST_URLS_V1.CATEGORY);
    return response.data.categories || [];
  }
}
