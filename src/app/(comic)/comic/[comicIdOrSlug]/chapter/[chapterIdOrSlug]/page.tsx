import { ChapterQuery } from "@/lib/server/queries/chapter-query";
import ChapterDetailClient from "./chapter-detail-client";
import { cache } from "react";
import { generateSEOMetadata } from "@/lib/seo";
import { generateChapterUrl } from "@/lib/uitls/seo";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/server/auth";

interface ComicPageProps {
  params: { comicIdOrSlug: string; chapterIdOrSlug: string };
}

const getChapterById = cache(
  async (comicIdOrSlug: string, chapterIdOrSlug: string) => {
    try {
      const session = await getServerSession(authOptions);

      const user = session?.user || null;
      return await ChapterQuery.getChapterById(
        comicIdOrSlug,
        chapterIdOrSlug,
        user?.id
      );
    } catch (error) {
      console.error("Error fetching chapter details:", error);
      return null;
    }
  }
);

export async function generateMetadata({ params }: ComicPageProps) {
  const { comicIdOrSlug, chapterIdOrSlug } = await params;

  const chapterData = await getChapterById(comicIdOrSlug, chapterIdOrSlug);

  if (!chapterData || !chapterData.chapter) {
    return {
      title: "Không tìm thấy chương",
      description: "Chương truyện không tồn tại hoặc đã bị xóa.",
      robots: "noindex",
    };
  }
  return generateSEOMetadata({
    title: chapterData.chapter.title,
    description: chapterData.comic?.description
      ?.replace(/<[^>]*>/g, "")
      .substring(0, 160),
    image: chapterData.chapter.coverImage,
    url:
      chapterData?.comic?.slug && chapterData.chapter.slug
        ? generateChapterUrl(chapterData.comic.slug, chapterData.chapter.slug)
        : "",
    type: "article",
    modifiedTime: chapterData.chapter.updatedAt,
    authors: [chapterData.comic?.authorName || ""],
  });
}

export default async function ChapterDetail({ params }: ComicPageProps) {
  const { comicIdOrSlug, chapterIdOrSlug } = await params;

  let result: {
    chapter: any;
    comic?: {
      id?: string;
      title?: string;
      slug?: string;
      description?: string;
      coverImage?: string;
    };
    prevChapter?: { id: string; name?: string };
    nextChapter?: { id: string; name?: string };
  } = {
    chapter: undefined,
    prevChapter: undefined,
    nextChapter: undefined,
  };

  try {
    if (comicIdOrSlug && chapterIdOrSlug) {
      const chapterResult = await getChapterById(
        comicIdOrSlug,
        chapterIdOrSlug
      );

      result = {
        chapter: chapterResult?.chapter,
        prevChapter: chapterResult?.prevChapter,
        nextChapter: chapterResult?.nextChapter,
        comic: chapterResult?.comic,
      };
    }
  } catch (error) {
    console.error("Error fetching chapter details:", error);
  }

  return <ChapterDetailClient initialChapter={result} />;
}
