import { chapterAction } from "@/lib/server/action/chapter-action";
import { handleApiRequest } from "@/lib/uitls/handle-api-request";
import { withAuth } from "@/middleware/auth";
import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  context: { params: Promise<{ comicIdOrSlug: string }> }
): Promise<NextResponse> => {
  const { comicIdOrSlug } = await context.params;
  if (!comicIdOrSlug)
    return NextResponse.json(
      { message: "Comic ID is required" },
      {
        status: HttpStatusCode.BadRequest,
      }
    );

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || undefined;
  const pageParam = searchParams.get("page");
  const limitParam = searchParams.get("limit");
  const page = pageParam !== null ? Number(pageParam) : undefined;
  const limit = limitParam !== null ? Number(limitParam) : undefined;

  const chapters = await chapterAction.getChaptersByComicId(
    comicIdOrSlug,
    q,
    page,
    limit
  );
  return NextResponse.json(chapters, {
    status: HttpStatusCode.Ok,
  });
};

export const POST = async (
  req: NextRequest,
  context: { params: Promise<{ comicIdOrSlug: string }> }
): Promise<NextResponse> => {
  return handleApiRequest(async () => {
    const auth = await withAuth([])(req);
    if ("error" in auth) {
      return NextResponse.json(
        { message: auth.error },
        { status: auth.status }
      );
    }
    const { comicIdOrSlug } = await context.params;

    if (!comicIdOrSlug)
      return NextResponse.json(
        { message: "Comic ID is required" },
        { status: HttpStatusCode.BadRequest }
      );
    const chapterData = await req.json();

    const newChapter = await chapterAction.createChapter(auth.user.id, {
      ...chapterData,
      comicIdOrSlug,
    });
    return NextResponse.json(newChapter, {
      status: HttpStatusCode.Created,
    });
  });
};
