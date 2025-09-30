import { notify } from "@/components/ui/notify";
import { REQUEST_URLS_V1 } from "@/config/request-urls";
import { $fetch, $globalFetch, $serverFetch } from "@/lib/axios";
import { IComic } from "@models/interfaces/i-comic";

export class ComicQuery {
  static async createComic(data: Partial<IComic>): Promise<IComic> {
    const response = await $fetch.post(REQUEST_URLS_V1.CREATE_COMIC, data);
    if (response.status === 200) {
      notify({
        type: "success",
        title: "Tạo truyện thành công",
        description: "Truyện đã được tạo thành công",
      });
    }
    return response.data;
  }

  static async getMyComics(
    keyword?: string,
    page?: number,
    limit?: number,
    client?: boolean
  ): Promise<{
    data: IComic[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
  }> {
    let response;
    if (client) {
      response = await $fetch.get(
        `${REQUEST_URLS_V1.MY_COMIC}?q=${keyword}&page=${page}&limit=${limit}`
      );
    } else {
      response = await $serverFetch.get(
        `${REQUEST_URLS_V1.MY_COMIC}?q=${keyword}&page=${page}&limit=${limit}`
      );
    }

    return {
      data: response.data.data,
      totalCount: response.data.totalCount,
      totalPages: response.data.totalPages,
      currentPage: response.data.currentPage,
    };
  }

  static async getComicByIdOrSlug(comicIdOrSlug: string): Promise<any> {
    const response = await $globalFetch.get(
      `${REQUEST_URLS_V1.COMIC}/${comicIdOrSlug}`
    );
    return response.data;
  }

  static async getRandomComics(numberComic: number): Promise<IComic[]> {
    const response = await $globalFetch.get(
      `${REQUEST_URLS_V1.COMIC}?numberComic=${numberComic}`
    );
    return response.data;
  }

  static async updateComic(
    comicId: string,
    data: Partial<IComic>
  ): Promise<IComic> {
    const response = await $fetch.patch(
      `${REQUEST_URLS_V1.COMIC}/${comicId}`,
      data
    );
    return response.data;
  }

  static async searchComics(queryString: string) {
    const response = await $globalFetch.get(
      `${REQUEST_URLS_V1.SEARCH_COMICS}?${queryString}`
    );
    return response.data;
  }

  static async getFilterOptions() {
    const response = await $globalFetch.post(
      `${REQUEST_URLS_V1.SEARCH_COMICS}`
    );
    return response.data;
  }

  static async getBookmarkedComic(ComicId: string) {
    const response = await $fetch.get(
      `${REQUEST_URLS_V1.COMIC}/${ComicId}/bookmark`
    );

    return response.data;
  }
}
