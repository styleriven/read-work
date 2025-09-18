import { UserRole } from "@/server/auth";
import "next-auth/jwt";
import { IToken } from "./token";
import { User } from "next-auth";
import { IUser } from "./user";

// Read more at: https://next-auth.js.org/getting-started/typescript#module-augmentation

declare module "next-auth/jwt" {
  interface JWT {
    /** The user's role. */
    accessToken?: IToken;
    refreshToken?: IToken;
    user?: IUser;
    error?: string;
  }
}

declare module "next/server" {
  interface NextRequest {
    user?: IUser;
  }
}
