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

      const filter: any = {
        deletedAt: null,
      };

      // Text search
      if (query.q) {
        filter.$or = [
          { title: { $regex: query.q, $options: "i" } },
          { description: { $regex: query.q, $options: "i" } },
          { authorName: { $regex: query.q, $options: "i" } },
          { artist: { $regex: query.q, $options: "i" } },
        ];
      }

      // Category filter
      if (query.categories) {
        filter.categoryId = { $in: query.categories };
      }

      // Status filter
      if (query.status) {
        filter.status = query.status;
      }

      // Type filter
      if (query.type) {
        filter.type = query.type;
      }

      // Age rating filter
      if (query.ageRating) {
        filter.ageRating = query.ageRating;
      }

      // Language filter
      if (query.language) {
        filter.language = query.language;
      }

      const sortOptions: { [key: string]: 1 | -1 } = {};
      const sortBy = query.sortBy || "createdAt";
      const sortOrder = query.sortOrder === "asc" ? 1 : -1;
      const page = parseInt(query.page || "1", 10) || 1;
      const limit = parseInt(query.limit || "20", 10) || 20;

      switch (sortBy) {
        case "title":
          sortOptions.title = sortOrder;
          break;
        case "views":
          sortOptions["stats.viewsCount"] = sortOrder;
          break;
        case "likes":
          sortOptions["stats.likesCount"] = sortOrder;
          break;
        case "rating":
          sortOptions["stats.avgRating"] = sortOrder;
          break;
        case "chapters":
          sortOptions["stats.chaptersCount"] = sortOrder;
          break;
        case "lastChapterAt":
          sortOptions.lastChapterAt = sortOrder;
          break;
        default:
          sortOptions.createdAt = sortOrder;
      }

      const data = await comicAction.searchComics({
        filter,
        sort: sortOptions,
        page,
        limit,
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
    const categories = await categoryAction.GetALLSummary();

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
