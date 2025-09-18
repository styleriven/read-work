import { IBase } from "./i-base";

export interface ILike extends IBase {
  userId: string; // User ID
  targetType: "comic" | "chapter" | "comment";
  targetId: string;
  deletedAt: Date;
}
