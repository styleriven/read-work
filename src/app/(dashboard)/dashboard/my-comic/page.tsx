import MyComicClient from "./my-comic-client";
import { ComicQuery } from "@/lib/server/queries/comic-query";
import { IComic } from "@models/interfaces/i-comic";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    keyword?: string;
    sort?: string;
  }>;
}

export default async function MyComicPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page);
  const limit = Number(params.limit) || 10;
  const keyword = params.keyword || "";
  const sort = params.sort || "truyen-moi";
  let result: { data: IComic[]; totalCount: number; isLoading: boolean } = {
    data: [],
    totalCount: 0,
    isLoading: false,
  };
  try {
    if (page) {
      result = await ComicQuery.getMyComics(keyword, page, limit);
    }
  } catch (err) {
    console.error("Error fetching comics:", err);
  }

  const { data: initialComics, totalCount: total, isLoading } = result;

  return (
    <MyComicClient
      initialComics={initialComics}
      initialTotal={total}
      initialPage={page}
      initialPageSize={limit}
      initialKeyword={keyword}
      initialSort={sort}
    />
  );
}
