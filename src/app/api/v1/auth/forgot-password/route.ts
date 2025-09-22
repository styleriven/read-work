import authAction from "@/lib/server/action/auth-action";
import userAction from "@/lib/server/action/user-action";
import { handleApiRequest } from "@/lib/uitls/handle-api-request";
import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  return handleApiRequest(async () => {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        {
          status: HttpStatusCode.BadRequest,
        }
      );
    }

    const user = await userAction.getUserByEmail(email, true);
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: HttpStatusCode.NotFound }
      );
    }

    await authAction.sendPasswordResetEmail(user);
    return NextResponse.json(
      { message: "Password reset email sent" },
      { status: HttpStatusCode.Ok }
    );
  });
};
