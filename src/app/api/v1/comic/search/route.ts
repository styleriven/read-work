// app/api/comics/search/route.ts
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import comicAction from "@/lib/server/action/comic-action";
import { HttpStatusCode } from "axios";
import { handleApiRequest } from "@/lib/uitls/handle-api-request";
import { ca } from "zod/v4/locales";
import { categoryAction } from "@/lib/server/action/category-action";

interface SearchQuery {
  q?: string;
  categories?: string[];
  status?: string;
  type?: string;
  ageRating?: string;
  language?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: string;
  limit?: string;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  return handleApiRequest(async () => {
    try {
      const { searchParams } = new URL(request.url);

      const query: SearchQuery = {
        q: searchParams.get("q") || undefined,
        categories: searchParams.get("categories")?.split(",") || undefined,
        status: searchParams.get("status") || undefined,
        type: searchParams.get("type") || undefined,
        ageRating: searchParams.get("ageRating") || undefined,
        language: searchParams.get("language") || undefined,
        sortBy: searchParams.get("sortBy") || "createdAt",
        sortOrder: (searchParams.get("sortOrder") as "asc" | "desc") || "desc",
        page: searchParams.get("page") || "1",
        limit: searchParams.get("limit") || "20",
      };

      const data = await comicAction.searchComics({
        query,
      });
      return NextResponse.json(data, {
        status: HttpStatusCode.Ok,
      });
    } catch (error) {
      console.error("Search API error:", error);
      return NextResponse.json(
        { message: "Internal server error" },
        {
          status: HttpStatusCode.InternalServerError,
        }
      );
    }
  });
}

export async function POST(request: NextRequest) {
  return handleApiRequest(async () => {
    const categories = await categoryAction.getALLSummary();

    const filterOptions = {
      categories,
      statuses: ["draft", "ongoing", "completed", "hiatus", "cancelled"],
      types: [
        { value: "suu-tam", label: "Sưu Tầm" },
        { value: "sang-tac", label: "Sáng Tác" },
        { value: "tu-dich", label: "Tự Dịch" },
      ],
      ageRatings: ["all-ages", "teen", "mature", "adult"],
      languages: ["vi", "en", "ja", "ko", "zh"],
      sortOptions: [
        { value: "createdAt", label: "Mới nhất" },
        { value: "views", label: "Lượt xem" },
        { value: "likes", label: "Lượt thích" },
        { value: "rating", label: "Đánh giá" },
        { value: "title", label: "Tên A-Z" },
      ],
    };
    return NextResponse.json(
      { filterOptions },
      {
        status: HttpStatusCode.Ok,
      }
    );
  });
}
