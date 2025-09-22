import UserRoles from "@/enums/Role";
import authAction from "@/lib/server/action/auth-action";
import { handleApiRequest } from "@/lib/uitls/handle-api-request";
import { withAuth } from "@/middleware/auth";
import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  return handleApiRequest(async () => {
    const auth = await withAuth([UserRoles.User])(req);
    if ("error" in auth) {
      return NextResponse.json(
        { message: auth.error },
        { status: auth.status }
      );
    }

    authAction.sendVerifyEmail(auth.user);
    return NextResponse.json(
      { message: "Verification email sent" },
      {
        status: HttpStatusCode.Ok,
      }
    );
  });
};
