import { IBase } from "./i-base";

export interface IRating extends IBase {
  userId: string;
  comicId: string;
  rating: number; // 1-5 stars
  review?: string;
  isPublic: boolean;
  deletedAt: Date;
}
