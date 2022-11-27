import { ServerError } from "../errors/server-error";
import { IHttpResponse } from "../interfaces/protocols/http-protocol";

export const badRequest = (error: Error): IHttpResponse => ({
  statusCode: 400,
  body: error
})

export const serverError = (): IHttpResponse => ({
  statusCode: 500,
  body: new ServerError()
})

