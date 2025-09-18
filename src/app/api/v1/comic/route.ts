import comicAction from "@/lib/server/action/comic-action";
import { handleApiRequest } from "@/lib/uitls/handle-api-request";
import { withAuth } from "@/middleware/auth";
import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  return handleApiRequest(async () => {
    const { searchParams } = new URL(req.url);
    const numberComic = searchParams.get("numberComic") || undefined;

    if (numberComic) {
      const comics = await comicAction.getRandomComic(
        numberComic as unknown as number
      );
      return new NextResponse(JSON.stringify(comics), {
        status: HttpStatusCode.Ok,
      });
    } else {
      return new NextResponse(
        JSON.stringify({ message: "numberComic is required" }),
        {
          status: HttpStatusCode.BadRequest,
        }
      );
    }
  });
};
