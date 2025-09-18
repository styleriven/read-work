export interface IToken {
  token: string;
  expires: Date;
}

export interface IRefreshReturn {
  accessToken?: IToken;
  refreshToken?: IToken;
  access?: IToken;
  refresh?: IToken;
}
