import { chapterAction } from "@/lib/server/action/chapter-action";
import { handleApiRequest } from "@/lib/uitls/handle-api-request";
import { withAuth } from "@/middleware/auth";
import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  context: { params: Promise<{ comicId: string }> }
): Promise<NextResponse> => {
  const { comicId } = await context.params;
  if (!comicId)
    return new NextResponse(
      JSON.stringify({ message: "Comic ID is required" }),
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
    comicId,
    q,
    page,
    limit
  );
  return new NextResponse(JSON.stringify(chapters), {
    status: HttpStatusCode.Ok,
  });
};

export const POST = async (
  req: NextRequest,
  context: { params: Promise<{ comicId: string }> }
): Promise<NextResponse> => {
  return handleApiRequest(async () => {
    const auth = await withAuth([])(req);
    if ("error" in auth) {
      return new NextResponse(JSON.stringify({ message: auth.error }), {
        status: auth.status,
      });
    }

    const { comicId } = await context.params;
    if (!comicId)
      return new NextResponse(
        JSON.stringify({ message: "Comic ID is required" }),
        {
          status: HttpStatusCode.BadRequest,
        }
      );

    const chapterData = await req.json();

    const newChapter = await chapterAction.createChapter(auth.user.id, {
      ...chapterData,
      comicId,
    });
    return new NextResponse(JSON.stringify(newChapter), {
      status: HttpStatusCode.Created,
    });
  });
};
