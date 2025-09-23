import { chapterAction } from "@/lib/server/action/chapter-action";
import { handleApiRequest } from "@/lib/uitls/handle-api-request";
import { withAuth } from "@/middleware/auth";
import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async (
  req: NextRequest,
  context: {
    params: Promise<{ comicIdOrSlug: string; chapterIdOrSlug: string }>;
  }
): Promise<NextResponse> => {
  return handleApiRequest(async () => {
    const auth = await withAuth([])(req);
    if ("error" in auth) {
      return NextResponse.json(
        { message: auth.error },
        { status: auth.status }
      );
    }

    const { chapterIdOrSlug } = await context.params;
    if (!chapterIdOrSlug)
      return NextResponse.json(
        { message: " Chapter ID or Slug are required" },
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
      chapterIdOrSlug,
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
    params: Promise<{ comicIdOrSlug: string; chapterIdOrSlug: string }>;
  }
): Promise<NextResponse> => {
  return handleApiRequest(async () => {
    const { chapterIdOrSlug } = await context.params;
    if (!chapterIdOrSlug)
      return NextResponse.json(
        { message: "Chapter ID or Slug are required" },
        {
          status: HttpStatusCode.BadRequest,
        }
      );
    const data = await chapterAction.getChapterByIdOrSlug(chapterIdOrSlug);
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
