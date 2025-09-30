import bookmarkAction from "@/lib/server/action/bookmark-action";
import { handleApiRequest } from "@/lib/uitls/handle-api-request";
import { withAuth } from "@/middleware/auth";
import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
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
        { message: "Comic ID or Slug are required" },
        {
          status: HttpStatusCode.BadRequest,
        }
      );
    const bookmark = await bookmarkAction.getByUserIdAndComicId(
      auth.user.id,
      comicIdOrSlug
    );
    return NextResponse.json(bookmark, {
      status: HttpStatusCode.Ok,
    });
  });
};
