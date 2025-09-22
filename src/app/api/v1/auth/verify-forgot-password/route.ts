import authAction from "@/lib/server/action/auth-action";
import { NextRequest, NextResponse } from "next/server";
import { HttpStatusCode } from "axios";
import { handleApiRequest } from "@/lib/uitls/handle-api-request";

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  return handleApiRequest(async () => {
    const { code, email } = await req.json();
    if (!code || !email) {
      return NextResponse.json(
        { message: "Code and email are required" },
        { status: HttpStatusCode.BadRequest }
      );
    }

    const [isValid, user] = await authAction.verifyForgotPassword(email, code);
    if (!isValid) {
      return NextResponse.json(
        { message: "Invalid or expired code" },
        { status: HttpStatusCode.BadRequest }
      );
    }
    return NextResponse.json({ message: "ok" }, { status: HttpStatusCode.Ok });
  });
};
