import { IBase } from "./i-base";

export interface IComment extends IBase {
  content: string;
  authorId: string;
  targetType: "comic" | "chapter";
  targetId: string; // Comic ID hoặc Chapter ID
  parentCommentId?: string;
  replyToUserId?: string;
  level: number;
  isEdited: boolean;
  editedAt?: Date;
  stats: {
    likesCount: number;
    repliesCount: number;
  };
  isPinned: boolean;
  isReported: boolean;
  reportCount: number;
  deletedAt: Date;
}
