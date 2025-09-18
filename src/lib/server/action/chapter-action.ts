import { IChapter } from "@models/interfaces/i-chapter";
import chapterRepository from "@models/repositories/chapter-repository";
import comicRepository from "@models/repositories/comic-repository";
import { message } from "antd";
import { HttpStatusCode } from "axios";
import { ApiError } from "next/dist/server/api-utils";
import { th } from "zod/v4/locales";

class ChapterAction {
  async getChaptersByComicId(
    comicId: string,
    q?: string,
    page?: number,
    limit?: number
  ) {
    try {
      const chapters = await chapterRepository.findByComicId(comicId, q, {
        page,
        limit,
      });
      return chapters;
    } catch (error) {
      console.error("Error fetching chapters:", error);
      throw error;
    }
  }

  async getChapterSummaryByComicId(
    comicId: string,
    q?: string,
    page?: number,
    limit?: number
  ) {
    try {
      const summary = await chapterRepository.getChapterSummaryByComicId(
        comicId,
        q,
        {
          page,
          limit,
        }
      );
      return summary;
    } catch (error) {
      console.error("Error fetching chapter summary:", error);
      throw error;
    }
  }

  async createChapter(userId: string, data: Partial<IChapter>) {
    try {
      const hasOwnership = await comicRepository.checkComicOwnership(
        userId,
        data.comicId!
      );
      if (!hasOwnership) {
        throw new ApiError(
          HttpStatusCode.Forbidden,
          JSON.stringify({
            message: "You do not have permission to add chapters to this comic",
          })
        );
      }

      const newChapter = await chapterRepository.create(data);
      return newChapter;
    } catch (error) {
      console.error("Error creating chapter:", error);
      throw error;
    }
  }
  async updateChapter(
    userId: string,
    chapterId: string,
    data: Partial<IChapter>
  ) {
    try {
      const chapter = await chapterRepository.findById(chapterId);
      if (!chapter) {
        throw new ApiError(HttpStatusCode.NotFound, "Chapter not found");
      }
      const hasOwnership = await comicRepository.checkComicOwnership(
        userId,
        chapter.comicId
      );
      if (!hasOwnership) {
        throw new ApiError(
          HttpStatusCode.Forbidden,
          JSON.stringify({
            message: "You do not have permission to edit this chapter",
          })
        );
      }
      const updatedChapter = await chapterRepository.update(chapterId, data);
      return updatedChapter;
    } catch (error) {
      console.error("Error updating chapter:", error);
      throw error;
    }
  }

  async getChapterById(comicId: string, chapterId: string) {
    try {
      const data = await chapterRepository.findChapterWithNeighbors(chapterId);
      const chapter = data?.chapter;
      if (!chapter || chapter.comicId !== comicId) {
        throw new ApiError(
          HttpStatusCode.NotFound,
          JSON.stringify({ message: "Chapter not found" })
        );
      }
      return data;
    } catch (error) {
      console.error("Error fetching chapter by ID:", error);
      throw error;
    }
  }

  async getChapterSummaryByComicIdFull(comicId: string) {
    try {
      const summary = await chapterRepository.getChapterSummaryByComicIdFull(
        comicId
      );
      return summary;
    } catch (error) {
      console.error("Error fetching full chapter summary:", error);
      throw error;
    }
  }
}
export const chapterAction = new ChapterAction();
