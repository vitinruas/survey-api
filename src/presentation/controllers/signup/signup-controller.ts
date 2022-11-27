import { IHttpRequest, IHttpResponse } from "../../protocols/http-protocol"
import { IController } from "../../protocols/controller-protocol"
import { MissingFieldError } from '../../errors/missing-field-error'
import { badRequest } from "../../helper/http-helper"

export class SignUpController implements IController {
  handle(httpRequest: IHttpRequest): IHttpResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

    for (const field of requiredFields) {
      if (!httpRequest.body[field])
        return badRequest(new MissingFieldError(field))
    }

    return {
      statusCode: 201,
    }
  }
}
