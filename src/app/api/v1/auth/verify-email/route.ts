import UserRoles from "@/enums/Role";
import AuthAction from "@/lib/server/action/auth-action";
import tokenAction from "@/lib/server/action/token-action";
import userAction from "@/lib/server/action/user-action";
import { handleApiRequest } from "@/lib/uitls/handle-api-request";
import { withAuth } from "@/middleware/auth";
import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (req: NextRequest): Promise<NextResponse> => {
  return handleApiRequest(async () => {
    const auth = await withAuth([UserRoles.User])(req);
    if ("error" in auth) {
      return NextResponse.json(
        { message: auth.error },
        { status: auth.status }
      );
    }

    const { code } = await req.json();
    if (!code) {
      return NextResponse.json({ message: "Missing code" }, { status: 400 });
    }

    const userId = req?.user?.id;
    if (typeof userId !== "string") {
      return NextResponse.json(
        { message: "Missing user id" },
        { status: HttpStatusCode.BadRequest }
      );
    }

    const isValid = await AuthAction.verifyEmailCode(userId, code);
    if (!isValid) {
      return NextResponse.json(
        { message: "Invalid code" },
        { status: HttpStatusCode.BadRequest }
      );
    }

    const user = await userAction.getUserById(userId);
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: HttpStatusCode.NotFound }
      );
    }

    const date = new Date();
    await userAction.update(user.id, { lastLoginAt: date });
    user.lastLoginAt = date;

    const tokens = await tokenAction.generateAuthTokens(user);
    return NextResponse.json(
      { user, tokens },
      {
        status: HttpStatusCode.Ok,
        headers: { "Content-Type": "application/json" },
      }
    );
  });
};
