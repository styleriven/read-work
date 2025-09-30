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
        authorId: { $in: [authorId] },
        ...(q ? { title: { $regex: q, $options: "i" } } : {}),
        deletedAt: null,
      })
      .exec();
    const skip = (page - 1) * limit;

    const data = await this.model
      .find({
        authorId: { $in: [authorId] },
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
    const pipeline = [
      {
        $match: {
          $or: [{ _id: idOrSlug }, { slug: idOrSlug }],
          deletedAt: null,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "authorId",
          foreignField: "_id",
          as: "authors",
          pipeline: [
            {
              $project: {
                _id: 1,
                email: 1,
                userName: 1,
                avatar: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "categories",
          pipeline: [
            {
              $project: {
                id: "$_id",
                name: 1,
              },
            },
          ],
        },
      },
      {
        $addFields: {
          id: "$_id",
        },
      },
    ];

    const [result] = await Promise.all([
      this.model.aggregate(pipeline).exec(),
      this.model
        .updateOne(
          { $or: [{ _id: idOrSlug }, { slug: idOrSlug }] },
          { $inc: { "stats.viewsCount": 1 } }
        )
        .exec()
        .catch((err) => console.error("Failed to update view count:", err)),
    ]);
    if (!result || result.length === 0) {
      return null;
    }
    return result[0];
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
        authorId: { $in: [userId] },
        deletedAt: null,
      })
    );
  }

  async search(filter: any, sort: any, pagination: PaginationOptions = {}) {
    await this.ensureConnection();
    const { page = 1, limit = 10 } = pagination;
    const now = new Date();
    if (sort._id === undefined) {
      sort._id = -1;
    }

    const pipeline = [
      { $match: filter },

      { $sort: sort },
      {
        $addFields: {
          id: "$_id",
        },
      },
      {
        $facet: {
          data: [
            { $skip: (page - 1) * limit },
            { $limit: limit },
            {
              $lookup: {
                from: "categories",
                localField: "categoryId",
                foreignField: "_id",
                as: "categories",
                pipeline: [
                  {
                    $project: {
                      id: "$_id",
                      name: 1,
                    },
                  },
                ],
              },
            },
            {
              $lookup: {
                from: "chapters",
                localField: "_id",
                foreignField: "comicId",
                as: "chapters",
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$deletedAt", null] },
                          { $lt: ["$publishedAt", now] },
                          { $eq: [{ $type: "$publishedAt" }, "date"] },
                        ],
                      },
                    },
                  },

                  { $count: "total" },
                ],
              },
            },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
    ];

    const result = await this.model.aggregate(pipeline).exec();

    const data = result[0]?.data || [];
    const totalCount = result[0]?.totalCount[0]?.count || 0;

    return {
      data,
      totalCount,
      limit,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    };
  }

  // async search(filter: any, sort: any, pagination: PaginationOptions = {}) {
  //   await this.ensureConnection();

  //   const { page = 1, limit = 10 } = pagination;
  //   if (sort._id === undefined) {
  //     sort._id = -1;
  //   }

  //   const totalCount = await this.model.countDocuments(filter).exec();
  //   const skip = (page - 1) * limit;

  //   const data = await this.model
  //     .find(filter)
  //     .sort(sort)
  //     .skip(skip)
  //     .limit(limit)
  //     .populate("categories", "id name")
  //     .exec();
  //   return { data, totalCount, limit, currentPage: page };
  // }

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
