import UserRoles from "@/enums/Role";
import userAction from "@/lib/server/action/user-action";
import { handleApiRequest } from "@/lib/uitls/handle-api-request";
import { withAuth } from "@/middleware/auth";
import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  return handleApiRequest(async () => {
    const auth = await withAuth([])(req);
    if ("error" in auth) {
      return new NextResponse(JSON.stringify({ message: auth.error }), {
        status: auth.status,
      });
    }

    const { id } = await context.params;
    if (!id)
      return new NextResponse(
        JSON.stringify({ message: "User ID is required" }),
        {
          status: HttpStatusCode.BadRequest,
        }
      );

    if (auth.user?.role === UserRoles.User && auth.user?.id !== id) {
      return new NextResponse(JSON.stringify({ message: "Forbidden" }), {
        status: HttpStatusCode.Forbidden,
      });
    }

    const user = await userAction.getFullUser(id);
    if (!user)
      return new NextResponse(JSON.stringify({ message: "User not found" }), {
        status: HttpStatusCode.NotFound,
      });

    return new NextResponse(JSON.stringify(user), {
      status: HttpStatusCode.Ok,
    });
  });
}
