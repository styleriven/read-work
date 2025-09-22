import comicAction from "@/lib/server/action/comic-action";
import { handleApiRequest } from "@/lib/uitls/handle-api-request";
import { withAuth } from "@/middleware/auth";
import context from "antd/es/app/context";
import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  context: { params: Promise<{ comicId: string }> }
): Promise<NextResponse> => {
  return handleApiRequest(async () => {
    const { comicId } = await context.params;
    if (!comicId)
      return NextResponse.json(
        { message: "Comic ID is required" },
        {
          status: HttpStatusCode.BadRequest,
        }
      );

    const comic = await comicAction.getComic(comicId);

    return NextResponse.json(comic, {
      status: HttpStatusCode.Ok,
    });
  });
};

export const PATCH = async (
  req: NextRequest,
  context: { params: Promise<{ comicId: string }> }
): Promise<NextResponse> => {
  return handleApiRequest(async () => {
    const auth = await withAuth([])(req);

    if ("error" in auth) {
      return NextResponse.json(
        { message: auth.error },
        { status: auth.status }
      );
    }

    const { comicId } = await context.params;
    if (!comicId)
      return NextResponse.json(
        { message: "Comic ID is required" },
        { status: HttpStatusCode.BadRequest }
      );

    const { title, authorName, description, category, type, coverImage } =
      await req.json();
    const updatedComic: any = {
      ...(title && { title }),
      ...(authorName && { authorName }),
      ...(description && { description }),
      ...(category && { categoryId: category }),
      ...(type && { type }),
      ...(coverImage && { coverImage }),
    };

    if (Object.keys(updatedComic).length === 0) {
      return NextResponse.json(
        { message: "No fields to update" },
        { status: HttpStatusCode.BadRequest }
      );
    }

    const result = await comicAction.updateComic(
      auth.user.id,
      comicId,
      updatedComic
    );
    if (!result) {
      return NextResponse.json(
        { message: "Comic not found" },
        {
          status: HttpStatusCode.NotFound,
        }
      );
    }

    return NextResponse.json(result, {
      status: HttpStatusCode.Ok,
    });
  });
};
