import { IBase } from "./i-base";

export interface IReadingHistory extends IBase {
  userId: string;
  comicId: string;
  chapterId: string;
  page: number; // Current page
  readAt: Date;
  readingTime: number; // in seconds
  isCompleted: boolean;
  deletedAt: Date;
}
