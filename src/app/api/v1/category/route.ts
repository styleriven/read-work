import { categoryAction } from "@/lib/server/action/category-action";
import { handleApiRequest } from "@/lib/uitls/handle-api-request";
import { HttpStatusCode } from "axios";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  return handleApiRequest(async () => {
    const categories = await categoryAction.getALL();
    return NextResponse.json(
      {
        categories,
      },
      {
        status: HttpStatusCode.Ok,
      }
    );
  });
};
