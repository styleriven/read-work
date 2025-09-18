import { TokenModel } from "../schemas";
import { IToken } from "../interfaces/i-token";
import { BaseRepository } from "./base-repository";

class TokenRepository extends BaseRepository<IToken> {}

export default new TokenRepository(TokenModel);
