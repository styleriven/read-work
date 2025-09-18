import { IBase } from "./i-base";

export interface IUser extends IBase {
  userName: string;
  email: string;
  password?: string;
  avatar?: string;
  displayName?: string;
  bio?: string;
  role: 1 | 2 | 3; // 1 : admin , 2 : system admin , 3 : user
  isVerified: boolean;
  isActive: boolean;
  accountCreatedAt: Date;
  lastLoginAt?: Date;
  socialProviders?: {
    google?: string;
    facebook?: string;
  };
  preferences: {
    theme: "light" | "dark" | "auto";
    autoNext: boolean;
    emailNotifications: boolean;
  };
  stats: {
    comicsCount: number;
    followersCount: number;
    followingCount: number;
    commentsCount: number;
    likesReceived: number;
  };
  deletedAt: Date;
}
