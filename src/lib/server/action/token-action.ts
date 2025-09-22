import moment from "moment";
import jwt from "jsonwebtoken";
import { IToken } from "@/types/token";
import { IUser } from "@models/interfaces/i-user";
import tokenRepository from "@models/repositories/token-repository";
class TokenAction {
  async generateAuthTokens(
    user: IUser
  ): Promise<{ access: IToken; refresh: IToken }> {
    try {
      const accessTokenExpires = moment().add(
        process.env.JWT_ACCESS_EXPIRATION_MINUTES,
        "minutes"
      );
      const accessToken = this.generateToken(
        user.id,
        accessTokenExpires,
        "access"
      );

      const refreshTokenExpires = moment().add(
        process.env.JWT_REFRESH_EXPIRATION_DAYS,
        "days"
      );
      const refreshToken = this.generateToken(
        user.id,

        refreshTokenExpires,
        "refresh"
      );
      await this.saveToken(
        refreshToken,
        user.id,
        refreshTokenExpires,
        "refresh"
      );

      return {
        access: {
          token: accessToken,
          expires: accessTokenExpires.toDate(),
        },
        refresh: {
          token: refreshToken,
          expires: refreshTokenExpires.toDate(),
        },
      };
    } catch (error) {
      throw error;
    }
  }

  generateToken = (
    userId: string,
    expires: moment.Moment,
    type: string,
    secret?: string | undefined
  ) => {
    const jwtSecret = secret ?? process.env.JWT_SECRET;

    const payload = {
      sub: userId,
      iat: moment().unix(),
      exp: expires.unix(),
      type,
    };

    return jwt.sign(payload, jwtSecret as jwt.Secret);
  };

  async saveToken(
    token: string,
    userId: string,
    expires: moment.Moment,
    type: string,
    blacklisted = false
  ): Promise<any> {
    try {
      const tokenDoc = await tokenRepository.create({
        token,
        userId,
        expiresAt: expires.toDate(),
        type,
        blacklisted,
      });
      return tokenDoc;
    } catch (error) {
      console.error("Error saving token:", error);
      throw error;
    }
  }

  async verifyToken(token: string, type: string): Promise<any> {
    const jwtSecret = process.env.JWT_SECRET;
    const payload = jwt.verify(token, jwtSecret as jwt.Secret);
    const tokenDoc = await tokenRepository.find({
      token,
      type,
      userId: String(payload.sub),
      blacklisted: false,
    });
    return tokenDoc;
  }

  async removeToken(id: string): Promise<any> {
    try {
      return await tokenRepository.destroy({ id });
    } catch (error) {
      console.error("Error removing token:", error);
      throw error;
    }
  }
}

export default new TokenAction();
