import { ChapterQuery } from "@/lib/server/queries/chapter-query";
import ChapterDetailClient from "./chapter-detail-client";

export default async function ChapterDetail({
  params,
}: {
  params: { comicIdOrSlug: string; chapterIdOrSlug: string };
}) {
  const { comicIdOrSlug, chapterIdOrSlug } = await params;

  let result: {
    chapter: any;
    prevChapter?: { id: string; name?: string };
    nextChapter?: { id: string; name?: string };
  } = {
    chapter: undefined,
    prevChapter: undefined,
    nextChapter: undefined,
  };

  try {
    if (comicIdOrSlug && chapterIdOrSlug) {
      const chapterResult = await ChapterQuery.getChapterById(
        comicIdOrSlug,
        chapterIdOrSlug
      );

      result = {
        chapter: chapterResult.chapter,
        prevChapter: chapterResult.prevChapter,
        nextChapter: chapterResult.nextChapter,
      };
    }
  } catch (error) {
    console.error("Error fetching chapter details:", error);
  }

  return <ChapterDetailClient initialChapter={result} />;
}
