import { IBase } from "./i-base";

export interface IChapter extends IBase {
  title: string;
  slug: string;
  comicId: string;
  content: string;
  chapterNumber: number;
  volumeNumber?: number;
  pages: {
    imageUrl: string;
    pageNumber: number;
    width?: number;
    height?: number;
  }[];
  isPremium: boolean;
  authorNote?: string;
  authorId: string;
  translatorNote?: string;
  stats: {
    viewsCount: number;
    likesCount: number;
    commentsCount: number;
  };
  publishedAt?: Date;
}
