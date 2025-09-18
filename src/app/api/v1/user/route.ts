import userAction from "@/lib/server/action/user-action";
import { handleApiRequest } from "@/lib/uitls/handle-api-request";
import { withAuth } from "@/middleware/auth";
import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (req: NextRequest): Promise<NextResponse> => {
  return handleApiRequest(async () => {
    const auth = await withAuth([])(req);
    if ("error" in auth) {
      return new NextResponse(JSON.stringify({ message: auth.error }), {
        status: auth.status,
      });
    }

    const { user_name, avatar, bio, preferences, display_name } =
      await req.json();
    const updatedUser: any = {
      ...(user_name && { userName: user_name }),
      ...(avatar && { avatar }),
      ...(bio && { bio }),
      ...(preferences && { preferences }),
      ...(display_name && { displayName: display_name }),
    };
    if (Object.keys(updatedUser).length === 0) {
      return new NextResponse(
        JSON.stringify({ message: "No fields to update" }),
        {
          status: HttpStatusCode.BadRequest,
        }
      );
    }

    const result = await userAction.updateUser(auth.user!.id, updatedUser);
    if (!result) {
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: HttpStatusCode.NotFound,
      });
    }
    return new NextResponse(JSON.stringify({ message: true }), {
      status: HttpStatusCode.Ok,
    });
  });
};
