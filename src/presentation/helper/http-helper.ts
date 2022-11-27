import { IHttpResponse } from "../protocols/http-protocol";

export const badRequest = (error: Error): IHttpResponse => ({
  statusCode: 400,
  body: error
})
