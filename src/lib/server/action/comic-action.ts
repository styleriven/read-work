import { slugify } from "@/lib/uitls/utils";
import { IComic } from "@models/interfaces/i-comic";
import comicRepository from "@models/repositories/comic-repository";
import { HttpStatusCode } from "axios";
import { ApiError } from "next/dist/server/api-utils";
import { v4 } from "uuid";

class ComicAction {
  async createComic(data: Partial<IComic>): Promise<IComic> {
    try {
      data._id = v4();
      const baseSlug = slugify(data.title || "");
      const slug = `${baseSlug}-${data._id.slice(0, 8)}`;
      data.slug = slug;
      const newComic = await comicRepository.create(data);

      return newComic;
    } catch (error) {
      console.error("Error creating comic:", error);
      throw error;
    }
  }

  async getComicsByAuthorId(
    authorId: string,
    q?: string,
    page?: number,
    limit?: number
  ) {
    try {
      const comics = await comicRepository.findByAuthorId(authorId, q, {
        page,
        limit,
      });
      return comics;
    } catch (error) {
      console.error("Error fetching comics by author ID:", error);
      throw error;
    }
  }

  async getComic(comicIdOrSlug: string): Promise<IComic> {
    try {
      const comic = await comicRepository.getFull(comicIdOrSlug);
      if (!comic) {
        throw new ApiError(HttpStatusCode.NotFound, "Comic not found");
      }
      return comic;
    } catch (error) {
      console.error("Error fetching comic by ID:", error);
      throw error;
    }
  }

  async getRandomComic(numberComic?: number): Promise<IComic[]> {
    try {
      const comics = await comicRepository.getRandomComics(numberComic);
      return comics;
    } catch (error) {
      console.error("Error fetching random comics:", error);
      throw error;
    }
  }

  async updateComic(
    userId: string,
    comicIdOrSlug: string,
    updateData: Partial<IComic>
  ): Promise<IComic | null> {
    try {
      const filter = { authorId: [userId] };
      if (updateData && updateData.title) {
        updateData.slug =
          slugify(updateData.title) + "-" + comicIdOrSlug.slice(0, 8);
      }
      const updatedComic = await comicRepository.updateIdOrSlug(
        comicIdOrSlug,
        updateData,
        filter
      );
      return updatedComic;
    } catch (error) {
      console.error("Error updating comic:", error);
      throw error;
    }
  }

  async searchComics({ query }: { query: any }): Promise<any> {
    try {
      const filter: any = {
        deletedAt: null,
      };

      // Text search
      if (query.q) {
        filter.$or = [
          { title: { $regex: query.q, $options: "i" } },
          { description: { $regex: query.q, $options: "i" } },
          { authorName: { $regex: query.q, $options: "i" } },
          { artist: { $regex: query.q, $options: "i" } },
        ];
      }

      // Category filter
      if (query.categories) {
        filter.categoryId = { $in: query.categories };
      }

      // Status filter
      if (query.status) {
        filter.status = query.status;
      }

      // Type filter
      if (query.type) {
        filter.type = query.type;
      }

      // Age rating filter
      if (query.ageRating) {
        filter.ageRating = query.ageRating;
      }

      // Language filter
      if (query.language) {
        filter.language = query.language;
      }

      const sortOptions: { [key: string]: 1 | -1 } = {};
      const sortBy = query.sortBy || "createdAt";
      const sortOrder = query.sortOrder === "asc" ? 1 : -1;
      const page = parseInt(query.page || "1", 10) || 1;
      const limit = parseInt(query.limit || "20", 10) || 20;

      switch (sortBy) {
        case "title":
          sortOptions.title = sortOrder;
          break;
        case "views":
          sortOptions["stats.viewsCount"] = sortOrder;
          break;
        case "likes":
          sortOptions["stats.likesCount"] = sortOrder;
          break;
        case "rating":
          sortOptions["stats.avgRating"] = sortOrder;
          break;
        case "chapters":
          sortOptions["stats.chaptersCount"] = sortOrder;
          break;
        case "lastChapterAt":
          sortOptions.lastChapterAt = sortOrder;
          break;
        default:
          sortOptions.createdAt = sortOrder;
      }

      const comics = await comicRepository.search(filter, sortOptions, {
        page,
        limit,
      });
      return comics;
    } catch (error) {
      console.error("Error searching comics:", error);
      throw error;
    }
  }
}

const comicAction = new ComicAction();
export default comicAction;
