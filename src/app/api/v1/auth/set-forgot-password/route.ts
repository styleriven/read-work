import authAction from "@/lib/server/action/auth-action";
import { handleApiRequest } from "@/lib/uitls/handle-api-request";
import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest): Promise<NextResponse> => {
  return handleApiRequest(async () => {
    const { code, email, new_password } = await req.json();
    if (!code || !email || !new_password) {
      return new NextResponse(
        JSON.stringify({
          message: "Code, email, and new password are required",
        }),
        { status: HttpStatusCode.BadRequest }
      );
    }

    await authAction.forgotPassword(code, email, new_password);
    return new NextResponse(
      JSON.stringify({ message: "Password updated successfully" }),
      {
        status: HttpStatusCode.Ok,
      }
    );
  });
};
