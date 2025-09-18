import { IComicCollection } from "@models/interfaces/i-comic-collection";
import { ComicCollectionModel } from "@models/schemas";
import { BaseRepository } from "./base-repository";

class ComicCollectionRepository extends BaseRepository<IComicCollection> {}
export default new ComicCollectionRepository(ComicCollectionModel);
