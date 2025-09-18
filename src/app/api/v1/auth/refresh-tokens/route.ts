import AuthAction from "@/lib/server/action/auth-action";
import { handleApiRequest } from "@/lib/uitls/handle-api-request";
import { HttpStatusCode } from "axios";

import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  return handleApiRequest(async () => {
    const { refresh_token } = await req.json();
    if (!refresh_token) {
      return new NextResponse(
        JSON.stringify({ message: "Refresh token is required" }),
        { status: HttpStatusCode.BadRequest }
      );
    }

    const tokens = await AuthAction.refreshAuth(refresh_token);
    return new NextResponse(JSON.stringify({ tokens }), {
      status: HttpStatusCode.Ok,
      headers: { "Content-Type": "application/json" },
    });
  });
};
