import { IBase } from "./i-base";

export interface IComicCollection extends IBase {
  name: string;
  description?: string;
  coverImage?: string;
  userId: string; // User ID
  comicIds: string[]; // Comic IDs
  isPublic: boolean;
  tags: string[];
  stats: {
    comicsCount: number;
    followersCount: number;
    viewsCount: number;
  };
  deletedAt: Date;
}
