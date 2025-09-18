import { IComic } from "@models/interfaces/i-comic";
import comicRepository from "@models/repositories/comic-repository";
import { HttpStatusCode } from "axios";
import { filter } from "framer-motion/dist/m";
import { ApiError } from "next/dist/server/api-utils";

class ComicAction {
  async createComic(data: Partial<IComic>): Promise<IComic> {
    try {
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

  async getComic(comicId: string): Promise<IComic> {
    try {
      const comic = await comicRepository.getFullById(comicId);
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
    id: string,
    updateData: Partial<IComic>
  ): Promise<IComic | null> {
    try {
      const filter = { authorId: userId };
      const updatedComic = await comicRepository.update(id, updateData, filter);
      return updatedComic;
    } catch (error) {
      console.error("Error updating comic:", error);
      throw error;
    }
  }

  async searchComics({
    filter,
    sort,
    page,
    limit,
  }: {
    filter: any;
    sort: any;
    page: number;
    limit: number;
  }): Promise<any> {
    try {
      const comics = await comicRepository.search(filter, sort, {
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
