import { ComicQuery } from "@/lib/server/queries/comic-query";
import ComicDetailClient from "./comic-detail-client";
import { isUUIDv4 } from "@/lib/uitls/utils";

export default async function ComicDetail({
  params,
}: {
  params: { comicIdOrSlug: string };
}) {
  const { comicIdOrSlug } = await params;
  let data = null;
  try {
    data = await ComicQuery.getComicByIdOrSlug(comicIdOrSlug);
  } catch (error) {
    console.error("Error fetching comic details:", error);
  }

  return <ComicDetailClient initialComic={data} />;
}
