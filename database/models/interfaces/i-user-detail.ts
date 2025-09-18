import { IBase } from "./i-base";
export interface IUserDetail extends IBase {
  userId: string;
  referral: string[];
  score: string;
  metallic: number;
  ruby: number;
  tickets: number;
  svipPoints: number;
}
