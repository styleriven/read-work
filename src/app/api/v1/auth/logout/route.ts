import authAction from "@/lib/server/action/auth-action";
import { handleApiRequest } from "@/lib/uitls/handle-api-request";
import { withAuth } from "@/middleware/auth";
import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  return handleApiRequest(async () => {
    const auth = await withAuth([])(req);
    if ("error" in auth) {
      return NextResponse.json(
        { message: auth.error },
        { status: auth.status }
      );
    }

    const { refresh_token } = await req.json();
    if (!refresh_token) {
      return NextResponse.json(
        { message: "Missing refresh token" },
        { status: HttpStatusCode.BadRequest }
      );
    }

    await authAction.logout(refresh_token);
    return NextResponse.json(
      { message: "Logged out successfully" },
      { status: HttpStatusCode.Ok }
    );
  });
};
