import { badRequest, serverError } from "../../helper/http-helper"
import { MissingFieldError, InvalidFieldError } from "../../errors"
import { IController, IEmailValidatorAdapter, IHttpRequest, IHttpResponse } from "../../interfaces/index"

export class SignUpController implements IController {
  constructor(private readonly emailValidatorAdapter: IEmailValidatorAdapter) {}
  handle(httpRequest: IHttpRequest): IHttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

    for (const field of requiredFields) {
      if (!httpRequest.body[field])
        return badRequest(new MissingFieldError(field))
    }

    if (httpRequest.body.password !== httpRequest.body.passwordConfirmation)
      return badRequest(new InvalidFieldError('passwordConfirmation'))

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
