import { categoryAction } from "@/lib/server/action/category-action";
import { handleApiRequest } from "@/lib/uitls/handle-api-request";
import { NextRequest, NextResponse } from "next/server";

interface categoryParams {
  params: Promise<{ categorySlug: string }>;
}

interface categoryQuery {
  q?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: string;
  limit?: string;
}

export const GET = async (
  req: NextRequest,
  { params }: categoryParams
): Promise<NextResponse> => {
  return handleApiRequest(async () => {
    const { categorySlug } = await params;
    const { searchParams } = new URL(req.url);
    const query: categoryQuery = {
      q: searchParams.get("q") || undefined,
      page: searchParams.get("page") || "1",
      limit: searchParams.get("limit") || "10",
    };
    const categories = await categoryAction.getCategoryBySlug(
      categorySlug,
      query
    );
    return NextResponse.json(categories);
  });
};
