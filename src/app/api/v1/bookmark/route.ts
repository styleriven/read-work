import { handleApiRequest } from "@/lib/uitls/handle-api-request";
import { withAuth } from "@/middleware/auth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  return handleApiRequest(async () => {
    // const auth = await withAuth([])(req);
    // if ("error" in auth) {
    //   return NextResponse.json(
    //     { message: auth.error },
    //     { status: auth.status }
    //   );
    // }

    const { searchParams } = new URL(req.url);
    // const userId = auth.user.id;
    const pageParam = searchParams.get("page");
    const limitParam = searchParams.get("limit");
    const page = pageParam !== null ? Number(pageParam) : undefined;
    const limit = limitParam !== null ? Number(limitParam) : undefined;

    return NextResponse.json({ message: "Not implemented" }, { status: 200 });
  });
};
