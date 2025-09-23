import { IComicCollection } from "@models/interfaces/i-comic-collection";
import { ComicCollectionModel } from "@models/schemas";
import { BaseRepository } from "./base-repository";

class ComicCollectionRepository extends BaseRepository<IComicCollection> {
  async getALL(): Promise<IComicCollection[]> {
    await this.ensureConnection();
    return await this.model.find();
  }
}
export default new ComicCollectionRepository(ComicCollectionModel);
