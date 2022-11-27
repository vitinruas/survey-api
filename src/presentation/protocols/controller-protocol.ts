import { IHttpRequest, IHttpResponse } from "./http-protocol";

export interface IController {
  handle: (request: IHttpRequest) => IHttpResponse
}
