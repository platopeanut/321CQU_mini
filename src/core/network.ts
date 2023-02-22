import Taro from "@tarojs/taro";
import {StdNetworkError} from "./error/StdNetworkError";
import stdToken, {TokenInfo} from "./StdToken";
import stdUser, {UserInfo} from "./StdUser";

const BASE_URL = 'https://api.321cqu.com/v1';

export type StdResponse<T> = {
  status: number
  msg: string
  data: T
};

const stdCoreRequest = Taro.request;

export async function stdRequest<ResType> (url: string, data: any = {}, needToken: boolean = true) {
  let header = {};
  if (needToken) {
    const tokenInfo = await handleToken();
    header["Authorization"] = "Bearer " + tokenInfo.token;
  }
  const res = await stdCoreRequest<StdResponse<ResType>>({
    url: BASE_URL + url,
    method: "POST",
    header: header,
    data: data
  });
  if (!StdNetworkError.test<ResType>(res.statusCode, res.data))
    throw new StdNetworkError({
      url: url,
      statusCode: res.statusCode,
      errMsg: res.errMsg,
      requestParams: data,
      responseData: res.data
    });
  return res.data.data;
}

async function getToken(username: string, password: string) {
  const info = await stdRequest<{
    token: string
    refreshToken: string
    tokenExpireTime: number
    refreshTokenExpireTime: number
  }>(
    "/authorization/login",
    {
      "apiKey": "koZfU+HGTNXRjxhSQiYpTQ==",
      "applyType": "WX_Mini_APP",
      "username": username,
      "password": password
    },
    false
  );

  stdToken.refreshTokenInfo = {
    refreshToken: info.refreshToken,
    refreshTokenExpireTime: info.refreshTokenExpireTime
  };
  stdToken.tokenInfo = {
    token: info.token,
    tokenExpireTime: info.tokenExpireTime
  };
}

async function updateToken() {
  stdToken.tokenInfo = await stdRequest<TokenInfo>(
    "/authorization/refreshToken",
    {"refreshToken": stdToken.refreshTokenInfo.refreshToken},
    false
  );
}

async function handleToken() {
  // 如果当前的token没有过期则直接返回
  if (checkTokenExpireTime(stdToken.tokenInfo.tokenExpireTime))
    return stdToken.tokenInfo;
  // 如果refreshToken不存在或者过期，则先获取
  if (!stdToken.refreshTokenInfo ||
      !checkTokenExpireTime(stdToken.refreshTokenInfo.refreshTokenExpireTime)) {
    // // 如果StuInfo信息缺失则抛出异常
    // if (StdUserInfoError.test()) throw new StdUserInfoError();
    const info = stdUser.userInfo;
    await getToken(info.auth, info.password);
  }
  else await updateToken();
  return stdToken.tokenInfo;
}

async function userValidate() {
  stdUser.userInfo = await stdRequest<UserInfo>("/edu_admin_center/validateAuth");
}

export async function login(username: string, password: string) {
  await getToken(username, password);
  await userValidate();
}

export async function bindOpenID() {
  const res = await Taro.login()
  await stdRequest("/notification/bindOpenId", {
    "uid": stdUser.userInfo.uid,
    "code": res.code
  })
}

// 判断token是否过期, true没有过期, false过期
function checkTokenExpireTime(expireTime: number, date=new Date()) {
  return expireTime - date.getTime() / 1000 > 0;
}
