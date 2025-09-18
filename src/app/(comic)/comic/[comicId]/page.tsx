import { ComicQuery } from "@/lib/server/queries/comic-query";
import ComicDetailClient from "./comic-detail-client";

export default async function ComicDetail({
  params,
}: {
  params: { comicId: string };
}) {
  const { comicId } = await params;
  let data = null;
  try {
    data = await ComicQuery.getComicById(comicId);
  } catch (error) {
    console.error("Error fetching comic details:", error);
  }

  return <ComicDetailClient initialComic={data} />;
}
