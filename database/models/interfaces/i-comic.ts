import { IBase } from "./i-base";

export interface IComic extends IBase {
  title: string;
  slug: string;
  description: string;
  coverImage?: string;
  authorId: string;
  authorName: string;
  artist?: string;
  categoryId: string[];
  type: string;
  status: "draft" | "ongoing" | "completed" | "hiatus" | "cancelled";
  visibility: "public" | "private" | "unlisted";
  isOriginal: boolean;
  language: string;
  originalLanguage?: string;
  publicationYear?: number;
  ageRating: "all-ages" | "teen" | "mature" | "adult";
  warnings: string[];
  comicType: "manga" | "manhwa" | "manhua" | "webtoon" | "comic";
  readingDirection: "left-to-right" | "right-to-left" | "top-to-bottom";
  stats: {
    viewsCount: number;
    likesCount: number;
    bookmarksCount: number;
    commentsCount: number;
    chaptersCount: number;
    avgRating: number;
    ratingCount: number;
  };
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords: string[];
  };
  publishedAt?: Date;
  lastChapterAt?: Date;
  deletedAt: Date;
}
