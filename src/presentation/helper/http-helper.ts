import { IHttpResponse } from "../interfaces/protocols/http-protocol";

export const badRequest = (error: Error): IHttpResponse => ({
  statusCode: 400,
  body: error
})
