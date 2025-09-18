import { ChapterQuery } from "@/lib/server/queries/chapter-query";
import ChapterDetailClient from "./chapter-detail-client";

export default async function ChapterDetail({
  params,
}: {
  params: { comicId: string; chapterId: string };
}) {
  const { comicId, chapterId } = await params;

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
    if (comicId && chapterId) {
      const chapterResult = await ChapterQuery.getChapterById(
        comicId,
        chapterId
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
