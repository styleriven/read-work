import UserRoles from "@/enums/Role";
import AuthAction from "@/lib/server/action/auth-action";
import { handleApiRequest } from "@/lib/uitls/handle-api-request";
import { withAuth } from "@/middleware/auth";
import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (req: NextRequest): Promise<NextResponse> => {
  return handleApiRequest(async () => {
    const auth = await withAuth([UserRoles.User])(req);
    if ("error" in auth) {
      return new NextResponse(JSON.stringify({ message: auth.error }), {
        status: auth.status,
      });
    }

    const { code } = await req.json();
    if (!code) {
      return new NextResponse(JSON.stringify({ message: "Missing code" }), {
        status: 400,
      });
    }

    const userId = req?.user?.id;
    if (typeof userId !== "string") {
      return new NextResponse(JSON.stringify({ message: "Missing user id" }), {
        status: HttpStatusCode.BadRequest,
      });
    }

    const isValid = await AuthAction.verifyEmailCode(userId, code);
    if (!isValid) {
      return new NextResponse(JSON.stringify({ message: "Invalid code" }), {
        status: HttpStatusCode.BadRequest,
      });
    }

    return new NextResponse(
      JSON.stringify({ message: "Email verified successfully" }),
      { status: HttpStatusCode.Ok }
    );
  });
};
