import { chapterAction } from "@/lib/server/action/chapter-action";
import { handleApiRequest } from "@/lib/uitls/handle-api-request";
import { withAuth } from "@/middleware/auth";
import context from "antd/es/app/context";
import { HttpStatusCode } from "axios";
import { data } from "framer-motion/dist/m";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (
  req: NextRequest,
  context: { params: Promise<{ comicId: string; chapterId: string }> }
): Promise<NextResponse> => {
  return handleApiRequest(async () => {
    const auth = await withAuth([])(req);
    if ("error" in auth) {
      return NextResponse.json(
        { message: auth.error },
        { status: auth.status }
      );
    }

    const { comicId, chapterId } = await context.params;
    if (!comicId || !chapterId)
      return NextResponse.json(
        { message: "Comic ID and Chapter ID are required" },
        {
          status: HttpStatusCode.BadRequest,
        }
      );

    const chapterData = await req.json();
    if (!chapterData)
      return NextResponse.json(
        { message: "No data provided" },
        {
          status: HttpStatusCode.BadRequest,
        }
      );

    const updatedChapter = await chapterAction.updateChapter(
      auth.user.id,
      chapterId,
      chapterData
    );
    return NextResponse.json(updatedChapter, {
      status: HttpStatusCode.Ok,
    });
  });
};

export const GET = async (
  req: NextRequest,
  context: {
    params: Promise<{ comicId: string; chapterId: string }>;
  }
): Promise<NextResponse> => {
  return handleApiRequest(async () => {
    const { comicId, chapterId } = await context.params;
    if (!comicId || !chapterId)
      return NextResponse.json(
        { message: "Comic ID and Chapter ID are required" },
        {
          status: HttpStatusCode.BadRequest,
        }
      );
    const data = await chapterAction.getChapterById(comicId, chapterId);
    if (!data?.chapter) {
      return NextResponse.json(
        { message: "Chapter not found" },
        {
          status: HttpStatusCode.NotFound,
        }
      );
    }
    return NextResponse.json(data, {
      status: HttpStatusCode.Ok,
    });
  });
};
