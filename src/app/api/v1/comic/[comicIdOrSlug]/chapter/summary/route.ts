import page from "@/app/page";
import { chapterAction } from "@/lib/server/action/chapter-action";
import { handleApiRequest } from "@/lib/uitls/handle-api-request";
import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  context: { params: Promise<{ comicIdOrSlug: string }> }
): Promise<NextResponse> => {
  return handleApiRequest(async () => {
    const { comicIdOrSlug } = await context.params;
    if (!comicIdOrSlug)
      return NextResponse.json(
        { message: "Comic ID is required" },
        { status: HttpStatusCode.BadRequest }
      );

    const { searchParams } = new URL(req.url);
    const full = searchParams.get("full") === "true";
    if (full) {
      const summary = await chapterAction.getChapterSummaryByComicIdFull(
        comicIdOrSlug
      );
      return NextResponse.json(
        { data: summary },
        { status: HttpStatusCode.Ok }
      );
    } else {
      const q = searchParams.get("q") || undefined;
      const pageParam = searchParams.get("page");
      const limitParam = searchParams.get("limit");
      const page = pageParam !== null ? Number(pageParam) : 1;
      const limit = limitParam !== null ? Number(limitParam) : 10;
      const summary = await chapterAction.getChapterSummaryByComicId(
        comicIdOrSlug,
        q,
        page,
        limit
      );
      return NextResponse.json(summary, {
        status: HttpStatusCode.Ok,
      });
    }
  });
};
