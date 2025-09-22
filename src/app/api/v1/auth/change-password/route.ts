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
    const { old_password, new_password } = await req.json();
    if (!old_password || !new_password) {
      return NextResponse.json(
        { message: "Old and new passwords are required" },
        { status: HttpStatusCode.BadRequest }
      );
    }
    await authAction.changePassword(auth.user, old_password, new_password);
    return NextResponse.json(
      { message: "Password changed successfully" },
      {
        status: HttpStatusCode.Ok,
      }
    );
  });
};
