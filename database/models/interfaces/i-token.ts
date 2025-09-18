import { IBase } from "./i-base";

export interface IToken extends IBase {
  userId: string;
  token: string;
  type: string;
  expiresAt: Date;
  blacklisted: boolean;
}
