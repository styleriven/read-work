import IVerifyCode from "@models/interfaces/i-verify-code";
import verifyCodeRepository from "@models/repositories/verify-code-repository";

class VerifyCodeAction {
  // Accept partial data when creating a code (DB will fill other fields)
  createCode(data: Partial<IVerifyCode>): Promise<IVerifyCode> {
    return verifyCodeRepository.create(data as Partial<IVerifyCode>);
  }

  deleteCode(filter: Partial<IVerifyCode>): Promise<number> {
    return verifyCodeRepository.destroy(filter);
  }

  getCode(filter: Partial<IVerifyCode>): Promise<IVerifyCode | null> {
    return verifyCodeRepository.find(filter);
  }
}

export default new VerifyCodeAction();
