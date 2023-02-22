import {StdError} from "./StdError";
import {StdResponse} from "../network";

export class StdNetworkError<ResType> extends StdError {

  constructor(options: {
    url: string
    statusCode: number
    errMsg: string
    requestParams: any
    responseData: StdResponse<ResType>
  }) {
    super(options.toString());
  }

  static test<ResType>(statusCode: number, response: StdResponse<ResType>): boolean {
    return statusCode >= 200 && statusCode < 300 && response.status === 1;
  }
}
