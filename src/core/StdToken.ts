import {stdGetStorageSync, stdSetStorageSync} from "./storage";
import StdModel from "./StdModel";

export type TokenInfo = {
  token: string
  tokenExpireTime: number
}

export type RefreshTokenInfo = {
  refreshToken: string
  refreshTokenExpireTime: number
}

class StdToken implements StdModel {
  private _tokenInfo: TokenInfo = {token: "", tokenExpireTime: -1};
  public get tokenInfo() { return this._tokenInfo; }
  public set tokenInfo(info: TokenInfo) {
    this._tokenInfo = info;
    console.log("TokenInfo", this._tokenInfo);
  }
  public get refreshTokenInfo() { return stdGetStorageSync<RefreshTokenInfo>("RefreshTokenInfo"); }
  public set refreshTokenInfo(info: RefreshTokenInfo) { stdSetStorageSync("RefreshTokenInfo", info); }
}

export default new StdToken();
