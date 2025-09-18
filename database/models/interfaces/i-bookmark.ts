import { IBase } from "./i-base";

export interface IBookmark extends IBase {
  userId: string;
  comicId: string;
  chapterId?: string;
  currentPage?: number;
  readingProgress: number;
  notes?: string;
  isPrivate: boolean;
  deletedAt: Date;
}
