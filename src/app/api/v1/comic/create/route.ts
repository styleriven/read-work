import { HttpStatusCode } from "axios";
import { handleApiRequest } from "@/lib/uitls/handle-api-request";
import { withAuth } from "@/middleware/auth";
import { NextRequest, NextResponse } from "next/server";
import comicAction from "@/lib/server/action/comic-action";

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  return handleApiRequest(async () => {
    const auth = await withAuth([])(req);
    if ("error" in auth) {
      return NextResponse.json(
        { message: auth.error },
        { status: auth.status }
      );
    }
    const { title, authorName, description, category, type, coverImage } =
      await req.json();

    if (
      !title ||
      !authorName ||
      !description ||
      !type ||
      !category ||
      !coverImage
    ) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: HttpStatusCode.BadRequest }
      );
    }
    const createdComic = comicAction.createComic({
      title,
      authorName,
      description,
      type,
      categoryId: category,
      coverImage,
      authorId: auth.user!.id,
    });

    return NextResponse.json(createdComic, {
      status: HttpStatusCode.Ok,
    });
  });
};
