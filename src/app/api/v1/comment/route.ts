import { CommentAction } from "@/lib/server/action/comment-action";
import { handleApiRequest } from "@/lib/uitls/handle-api-request";
import { withAuth } from "@/middleware/auth";
import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  return handleApiRequest(async () => {
    const { searchParams } = new URL(req.url);
    const targetId = searchParams.get("targetId") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    if (!targetId) {
      return NextResponse.json(
        { message: "targetId query parameter is required" },
        { status: HttpStatusCode.BadRequest }
      );
    }
    const data = await CommentAction.getCommentsByTargetId(
      targetId,
      page,
      limit
    );

    return NextResponse.json(data, { status: HttpStatusCode.Ok });
  });
};

export const POST = async (req: NextRequest) => {
  return handleApiRequest(async () => {
    const auth = await withAuth([])(req);

    if ("error" in auth) {
      return NextResponse.json(
        { message: auth.error },
        { status: auth.status }
      );
    }
    const { targetId, targetType, content, parentCommentId } = await req.json();

    if (!targetId || !targetType || !content) {
      return NextResponse.json(
        { message: "targetId, targetType and content are required" },
        { status: HttpStatusCode.BadRequest }
      );
    }
    const data = await CommentAction.createComment({
      authorId: auth.user.id,
      targetId,
      targetType,
      content,
      parentCommentId,
    });
    return NextResponse.json(data, { status: HttpStatusCode.Created });
  });
};
