import { ICategory } from "@models/interfaces/i-category";
import { CategoryModel } from "@models/schemas";
import { BaseRepository } from "./base-repository";

class CategoryRepository extends BaseRepository<ICategory> {
  async getALL(): Promise<ICategory[]> {
    await this.ensureConnection();
    return await this.model.find();
  }

  async getALLSummary(): Promise<{ id: string; name: string }[]> {
    await this.ensureConnection();
    return await this.model.find().select("id name slug");
  }

  async getCategoryBySlug(
    filter: any,
    q?: string,
    options?: { page?: number; limit?: number }
  ) {
    await this.ensureConnection();

    const { page = 1, limit = 10 } = options || {};
    const skip = (page - 1) * limit;
    const now = new Date();

    const result = await this.model.aggregate([
      { $match: filter },

      {
        $lookup: {
          from: "comics",
          let: { categoryId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ["$$categoryId", "$categoryId"] },
                    { $eq: ["$deletedAt", null] },
                  ],
                },
              },
            },
            ...(q ? [{ $match: { title: { $regex: q, $options: "i" } } }] : []),
            {
              $lookup: {
                from: "chapters",
                let: { comicId: "$_id" },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$comicId", "$$comicId"] },
                          { $eq: ["$deletedAt", null] },
                          { $lt: ["$publishedAt", now] },
                          { $eq: [{ $type: "$publishedAt" }, "date"] },
                        ],
                      },
                    },
                  },
                  { $count: "total" },
                ],
                as: "chapterInfo",
              },
            },

            {
              $addFields: {
                chaptersCount: {
                  $ifNull: [{ $arrayElemAt: ["$chapterInfo.total", 0] }, 0],
                },
              },
            },

            { $project: { chapterInfo: 0 } },

            {
              $facet: {
                data: [
                  { $sort: { _id: -1 } },
                  { $skip: skip },
                  { $limit: limit },
                ],
                totalCount: [{ $count: "count" }],
              },
            },
          ],
          as: "comicsInfo",
        },
      },

      {
        $addFields: {
          comics: {
            $ifNull: [{ $arrayElemAt: ["$comicsInfo.data", 0] }, []],
          },
          comicsCount: {
            $ifNull: [{ $arrayElemAt: ["$comicsInfo.totalCount.count", 0] }, 0],
          },
        },
      },

      { $project: { comicsInfo: 0 } },
    ]);

    const category = result[0] || null;

    if (!category) {
      return {
        data: null,
        comics: [],
        totalCount: 0,
        totalPages: 0,
        currentPage: page,
      };
    }

    const totalCount = category.comicsCount;

    return {
      data: category,
      comics: category.comics,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    };
  }
}

export default new CategoryRepository(CategoryModel);
