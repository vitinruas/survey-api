import { IHttpRequest, IHttpResponse } from "../../interfaces/protocols/http-protocol"
import { IController } from "../../interfaces/protocols/controller-protocol"
import { MissingFieldError } from '../../errors/missing-field-error'
import { badRequest } from "../../helper/http-helper"
import { InvalidFieldError } from "../../errors/invalid-field-error"
import { IEmailValidatorAdapter } from "../../interfaces/dependencies/email-validator-adapter-dependency"
import { ServerError } from "../../errors/server-error"

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
      return {
        statusCode: 500,
        body: new ServerError()
      }
    }

  }
}
