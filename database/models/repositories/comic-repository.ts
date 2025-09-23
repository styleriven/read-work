import { IComic } from "@models/interfaces/i-comic";
import { BaseRepository } from "./base-repository";
import { ComicModel } from "@models/schemas";

class ComicRepository extends BaseRepository<IComic> {
  async findByAuthorId(
    authorId: string,
    q?: string,
    pagination: PaginationOptions = {}
  ) {
    this.ensureConnection();
    const { page = 1, limit = 10 } = pagination;
    const totalCount = await this.model
      .countDocuments({
        authorId,
        ...(q ? { title: { $regex: q, $options: "i" } } : {}),
        deletedAt: null,
      })
      .exec();
    const skip = (page - 1) * limit;

    const data = await this.model
      .find({
        authorId,
        ...(q ? { title: { $regex: q, $options: "i" } } : {}),
        deletedAt: null,
      })
      .skip(skip)
      .limit(limit)
      .exec();
    const totalPages = Math.ceil((totalCount as unknown as number) / limit);
    return { data, totalCount, totalPages, currentPage: page };
  }

  async getFull(idOrSlug: string): Promise<IComic | null> {
    await this.ensureConnection();

    const comic = await this.model
      .findOneAndUpdate(
        { $or: [{ _id: idOrSlug }, { slug: idOrSlug }], deletedAt: null },
        { $inc: { "stats.viewsCount": 1 } },
        { new: true }
      )
      .populate("author", "id email userName avatar")
      .populate("categories", "id name")
      .exec();

    return comic;
  }

  async getRandomComics(numberComic?: number): Promise<IComic[]> {
    await this.ensureConnection();
    const pipeline: any[] = [{ $match: { deletedAt: null } }];

    if (numberComic) {
      const size = Number(numberComic);
      if (isNaN(size) || size <= 0) {
        throw new Error("Invalid size for random comics");
      }
      pipeline.push({ $sample: { size } });
    }

    let comics = await this.model.aggregate(pipeline).exec();
    const comicsWithId = comics.map((c) => ({ ...c, id: c._id }));
    comics = await this.model.populate(comicsWithId, {
      path: "categories",
      select: "id name",
    });

    return comics;
  }

  async checkComicOwnership(userId: string, comicId: string): Promise<boolean> {
    await this.ensureConnection();
    return Boolean(
      await this.model.exists({
        _id: comicId,
        authorId: userId,
        deletedAt: null,
      })
    );
  }

  async search(filter: any, sort: any, pagination: PaginationOptions = {}) {
    await this.ensureConnection();

    const { page = 1, limit = 10 } = pagination;
    if (sort._id === undefined) {
      sort._id = -1;
    }

    const totalCount = await this.model.countDocuments(filter).exec();
    const skip = (page - 1) * limit;

    const data = await this.model
      .find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate("categories", "id name")
      .exec();
    return { data, totalCount, limit, currentPage: page };
  }

  async getALL(): Promise<IComic[]> {
    await this.ensureConnection();
    return await this.model.find();
  }

  async updateIdOrSlug(
    idOrSlug: string,
    updateData: Partial<IComic>,
    filter: Partial<IComic> = {}
  ): Promise<IComic | null> {
    await this.ensureConnection();
    return (await this.model
      .findOneAndUpdate(
        {
          $or: [{ _id: idOrSlug }, { slug: idOrSlug }],
          deletedAt: null,
          ...(filter as any),
        },
        updateData,
        { new: true }
      )
      .exec()) as IComic | null;
  }
}

export default new ComicRepository(ComicModel);
