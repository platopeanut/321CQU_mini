import {StdError} from "./StdError";
import {UserInfo} from "../StdUser";

export class StdUserInfoError extends StdError {

  constructor(userInfo: UserInfo | undefined) { super("User Info Lack: " + userInfo); }
}
