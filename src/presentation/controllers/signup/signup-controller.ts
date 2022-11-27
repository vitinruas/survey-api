import { IController } from "../../interfaces/protocols/controller-protocol"
import { IHttpRequest, IHttpResponse } from "../../interfaces/protocols/http-protocol"
import { badRequest, serverError } from "../../helper/http-helper"
import { IEmailValidatorAdapter } from "../../interfaces/dependencies/email-validator-adapter-dependency"
import { MissingFieldError, InvalidFieldError } from "../../errors"

export class SignUpController implements IController {
  constructor(private readonly emailValidatorAdapter: IEmailValidatorAdapter) {}
  handle(httpRequest: IHttpRequest): IHttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

    for (const field of requiredFields) {
      if (!httpRequest.body[field])
        return badRequest(new MissingFieldError(field))
    }

    const emailIsValid = this.emailValidatorAdapter.isValid(httpRequest.body.email)
    if (!emailIsValid)
      return badRequest(new InvalidFieldError('email'))

    return {
      statusCode: 201,
    }
    } catch (error) {
      console.error(error);
      return serverError()
    }

  }
}
