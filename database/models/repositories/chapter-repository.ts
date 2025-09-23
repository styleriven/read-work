import { ChapterModel } from "@models/schemas";
import { BaseRepository } from "./base-repository";
import { IChapter } from "@models/interfaces/i-chapter";
class ChapterRepository extends BaseRepository<IChapter> {
  async findByComicId(
    comicId: string,
    q?: string,
    pagination: PaginationOptions = {}
  ) {
    await this.ensureConnection();
    const { page = 1, limit = 10 } = pagination;
    const filter: any = {
      comicId,
      deletedAt: null,
    };
    if (q) {
      filter.title = { $regex: q, $options: "i" };
    }
    const totalCount = await this.model.countDocuments(filter).exec();
    const skip = (page - 1) * limit;
    const chapters = await this.model
      .find(filter)
      .skip(skip)
      .limit(limit)
      .exec();
    return {
      data: chapters,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    };
  }

  async findChapterWithNeighbors(chapterIdOrSlug: string) {
    await this.ensureConnection();
    const now = new Date();

    const result = await this.model.aggregate([
      {
        $match: {
          $or: [{ _id: chapterIdOrSlug }, { slug: chapterIdOrSlug }],
          deletedAt: null,
          publishedAt: { $lt: now, $ne: null },
        },
      },
      {
        $lookup: {
          from: this.model.collection.name,
          let: {
            comicId: "$comicId",
            chapterNum: "$chapterNumber",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$comicId", "$$comicId"] },
                    { $lt: ["$chapterNumber", "$$chapterNum"] },
                    { $eq: ["$deletedAt", null] },
                    { $lt: ["$publishedAt", now] },
                    { $eq: [{ $type: "$publishedAt" }, "date"] },
                  ],
                },
              },
            },
            { $sort: { chapterNumber: -1 } },
            { $limit: 1 },
            {
              $project: {
                id: "$_id",
                title: 1,
                chapterNumber: 1,
                comicId: 1,
                slug: 1,
              },
            },
          ],
          as: "prevChapter",
        },
      },
      {
        $lookup: {
          from: this.model.collection.name,
          let: {
            comicId: "$comicId",
            chapterNum: "$chapterNumber",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$comicId", "$$comicId"] },
                    { $gt: ["$chapterNumber", "$$chapterNum"] },
                    { $eq: ["$deletedAt", null] },
                    { $lt: ["$publishedAt", now] },
                    { $eq: [{ $type: "$publishedAt" }, "date"] },
                  ],
                },
              },
            },
            { $sort: { chapterNumber: 1 } },
            { $limit: 1 },
            {
              $project: {
                id: "$_id",
                title: 1,
                chapterNumber: 1,
                comicId: 1,
                slug: 1,
              },
            },
          ],
          as: "nextChapter",
        },
      },
      {
        $addFields: {
          prevChapter: { $arrayElemAt: ["$prevChapter", 0] },
          nextChapter: { $arrayElemAt: ["$nextChapter", 0] },
        },
      },
    ]);
    const currentChapter = result[0];
    if (!currentChapter) return null;

    this.model
      .updateOne(
        { $or: [{ _id: chapterIdOrSlug }, { slug: chapterIdOrSlug }] },
        { $inc: { "stats.viewsCount": 1 } }
      )
      .exec();

    const { prevChapter, nextChapter, ...chapterData } = currentChapter;

    return {
      chapter: chapterData,
      prevChapter: prevChapter || null,
      nextChapter: nextChapter || null,
    };
  }

  async getChapterSummaryByComicId(
    comicId: string,
    q?: string,
    pagination: PaginationOptions = {}
  ) {
    await this.ensureConnection();
    const { page = 1, limit = 10 } = pagination;
    const filter: any = {
      comicId,
      deletedAt: null,
      publishedAt: { $lt: new Date(), $ne: null },
    };
    if (q) {
      filter.title = { $regex: q, $options: "i" };
    }
    const totalCount = await this.model.countDocuments(filter);
    const chapters = await this.model
      .find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .select("id title chapterNumber comicId slug")
      .sort({ chapterNumber: 1 })
      .exec();
    return {
      data: chapters,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    };
  }

  async getChapterSummaryByComicIdFull(comicId: string) {
    await this.ensureConnection();
    const filter: any = {
      comicId,
      deletedAt: null,
      publishedAt: { $lt: new Date(), $ne: null },
    };
    const chapters = await this.model
      .find(filter)
      .select("id title chapterNumber comicId slug")
      .exec();
    return chapters;
  }

  async getALL() {
    await this.ensureConnection();
    return this.model.find({}).exec();
  }
}
export default new ChapterRepository(ChapterModel);
