import comicAction from "@/lib/server/action/comic-action";
import { handleApiRequest } from "@/lib/uitls/handle-api-request";
import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return handleApiRequest(async () => {
    const { searchParams } = new URL(req.url);
    const numberComic = searchParams.get("numberComic");

    if (!numberComic) {
      return NextResponse.json(
        { message: "numberComic is required" },
        { status: HttpStatusCode.BadRequest }
      );
    }

    const comics = await comicAction.getRandomComic(Number(numberComic));
    return NextResponse.json(comics, {
      status: HttpStatusCode.Ok,
    });
  });
}
