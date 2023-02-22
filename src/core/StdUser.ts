import {stdGetStorageSync, stdSetStorageSync} from "./storage";
import {StdUserInfoError} from "./error/StdUserInfoError";
import StdModel from "./StdModel";

export type UserInfo = {
  uid: string       // 用户唯一id
  sid: string       // 学号
  auth: string      // 统一身份证号
  password: string  // 密码
  name: string      // 姓名
}

class StdUser implements StdModel {
  private _userInfo: UserInfo;
  public get userInfo() {
    if (!this._userInfo) {
      const info = stdGetStorageSync<UserInfo>("UserInfo");
      if (!info) throw new StdUserInfoError(info);
      else this._userInfo = info;
    }
    return this._userInfo;
  }
  public set userInfo(info: UserInfo) {
    this._userInfo = info;
    stdSetStorageSync("UserInfo", info);
  }
}

export default new StdUser();
