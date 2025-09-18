import { IBase } from "./i-base";

export default interface IVerifyCode extends IBase {
  userId: string;
  code: string;
  type: "verifyEmail" | "resetPassword";
  expiredAt: Date;
  deletedAt: Date | null;
}
