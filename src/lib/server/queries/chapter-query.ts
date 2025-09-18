import { REQUEST_URLS_V1 } from "@/config/request-urls";
import { $fetch, $globalFetch } from "@/lib/axios";
import { IChapter } from "@models/interfaces/i-chapter";

export class ChapterQuery {
  static async getChaptersByComicId(
    comicId: string,
    keyword?: string,
    page?: number,
    limit?: number
  ): Promise<{
    data: IChapter[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
  }> {
    let response;
    response = await $globalFetch.get(
      `${REQUEST_URLS_V1.COMIC}/${comicId}/chapter?q=${keyword}&page=${page}&limit=${limit}`
    );

    return {
      data: response.data.data,
      totalCount: response.data.totalCount,
      totalPages: response.data.totalPages,
      currentPage: response.data.currentPage,
    };
  }

  static async createChapter(data: Partial<IChapter>): Promise<IChapter> {
    const response = await $fetch.post(
      `${REQUEST_URLS_V1.COMIC}/${data.comicId}/chapter`,
      data
    );
    return response.data;
  }

  static async updateChapter(
    chapterId: string,
    data: Partial<IChapter>
  ): Promise<IChapter> {
    return await $fetch.put(
      `${REQUEST_URLS_V1.COMIC}/${data.comicId}/chapter/${chapterId}`,
      data
    );
  }

  static async getChapterById(
    comicId: string,
    chapterId: string
  ): Promise<{
    chapter: IChapter;
    prevChapter?: { id: string; name?: string };
    nextChapter?: { id: string; name?: string };
  }> {
    const response = await $globalFetch.get(
      `${REQUEST_URLS_V1.COMIC}/${comicId}/chapter/${chapterId}`
    );
    return response.data;
  }

  static async getChapterSummaryByComicId(
    comicId: string,
    keyword?: string,
    page?: number,
    limit?: number,
    full?: boolean,
    server?: boolean
  ): Promise<{
    data: { id: string; title: string; chapterNumber: number }[];
    totalCount: number;
    totalPages: number;
    full?: boolean;
    currentPage: number;
  }> {
    let response;
    response = await $globalFetch.get(
      `${REQUEST_URLS_V1.COMIC}/${comicId}/chapter/summary?q=${keyword}&page=${page}&limit=${limit}&full=${full}`
    );
    return {
      data: response.data.data,
      totalCount: response.data.totalCount,
      totalPages: response.data.totalPages,
      currentPage: response.data.currentPage,
    };
  }
}
