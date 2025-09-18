import { IBase } from "./i-base";

export interface IFollow extends IBase {
  followerId: string; // User ID
  followingId: string; // User ID
  deletedAt: Date;
}
