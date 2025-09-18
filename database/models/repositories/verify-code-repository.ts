import IVerifyCode from "@models/interfaces/i-verify-code";
import { BaseRepository } from "./base-repository";
import { VerifyCodeModel } from "../schemas";
class VerifyRepository extends BaseRepository<IVerifyCode> {}

export default new VerifyRepository(VerifyCodeModel);
