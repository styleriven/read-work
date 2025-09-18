import { ICategory } from "@models/interfaces/i-category";
import { CategoryModel } from "@models/schemas";
import { BaseRepository } from "./base-repository";

class CategoryRepository extends BaseRepository<ICategory> {
  async GetALL(): Promise<ICategory[]> {
    await this.ensureConnection();
    return await this.model.find();
  }

  async GetALLSummary(): Promise<{ id: string; name: string }[]> {
    await this.ensureConnection();
    return await this.model.find().select("id name");
  }
}
export default new CategoryRepository(CategoryModel);
