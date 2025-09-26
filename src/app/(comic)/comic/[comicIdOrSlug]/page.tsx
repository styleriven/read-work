import { ComicQuery } from "@/lib/server/queries/comic-query";
import ComicDetailClient from "./comic-detail-client";
import { Metadata } from "next";
import { generateComicUrl } from "@/lib/uitls/seo";
import { generateSEOMetadata } from "@/lib/seo";
import { cache } from "react";
import console from "console";

interface ComicPageProps {
  params: { comicIdOrSlug: string };
}

const getComicByIdOrSlug = cache(async (comicIdOrSlug: string) => {
  try {
    return await ComicQuery.getComicByIdOrSlug(comicIdOrSlug);
  } catch (error) {
    console.error("Error fetching comic details:", error);
    return null;
  }
});

export async function generateMetadata({
  params,
}: ComicPageProps): Promise<Metadata> {
  const { comicIdOrSlug } = await params;
  const data = await getComicByIdOrSlug(comicIdOrSlug);
  if (!data) {
    return generateSEOMetadata({
      title: "Không tìm thấy truyện",
      noIndex: true,
    });
  }
  return generateSEOMetadata({
    title: data.title,
    description: data.description?.replace(/<[^>]*>/g, "").substring(0, 160),
    image: data.coverImage,
    url: generateComicUrl(data.slug),
    type: "article",
    modifiedTime: data?.updatedAt,
    authors: [data.authors.map((a: any) => a.name).join(", ")],
    tags: [...(data.categories?.map((x: any) => x.name) ?? [])],
  });
}

export default async function ComicDetail({ params }: ComicPageProps) {
  const { comicIdOrSlug } = await params;
  let data = null;
  try {
    data = await getComicByIdOrSlug(comicIdOrSlug);
  } catch (error) {
    console.error("Error fetching comic details:", error);
  }

  return <ComicDetailClient initialComic={data} />;
}
