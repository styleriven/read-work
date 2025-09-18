import { UserRole } from "@/enums/roles";
import { IToken } from "./token";

export interface IUser {
  id: string;
  userName: string;
  email: string | null;
  password?: string;
  avatar: string | null;
  displayName?: string;
  bio?: string;
  role: UserRole;
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

  detail: {
    referral: string[];
    metallic: number;
    ruby: number;
    tickets: number;
    svipPoints: number;
  };
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  access: IToken;
  refresh: IToken;
}
