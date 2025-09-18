import { withAuth } from "@/middleware/auth";
import { handleApiRequest } from "@/lib/uitls/handle-api-request";
import comicAction from "@/lib/server/action/comic-action";
import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  return handleApiRequest(async () => {
    const auth = await withAuth([])(req);
    if ("error" in auth) {
      return new NextResponse(JSON.stringify({ message: auth.error }), {
        status: auth.status,
      });
    }

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || undefined;
    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");
    const page = pageParam !== null ? Number(pageParam) : undefined;
    const limit = limitParam !== null ? Number(limitParam) : undefined;
    const comics = await comicAction.getComicsByAuthorId(
      auth.user!.id,
      q,
      page,
      limit
    );

    return new NextResponse(JSON.stringify(comics), {
      status: HttpStatusCode.Ok,
    });
  });
};
