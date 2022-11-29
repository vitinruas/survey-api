import { badRequest, serverError } from '../../helper/http-helper'
import { MissingFieldError, InvalidFieldError } from '../../errors'
import {
  IController,
  IEmailValidatorAdapter,
  IHttpRequest,
  IHttpResponse,
} from '../../interfaces/index'
import { IAddAccountUseCase } from '../../../domain/usecase/add-account-usecase'
import { IAddAccountDTO } from '../../../domain/dtos/add-account-dto'

export class SignUpController implements IController {
  constructor(
    private readonly emailValidatorAdapter: IEmailValidatorAdapter,
    private readonly addAccountUseCase: IAddAccountUseCase
  ) {}

  handle(httpRequest: IHttpRequest): IHttpResponse {
    try {
      const requiredFields = [
        'name',
        'email',
        'password',
        'passwordConfirmation',
      ]

      for (const field of requiredFields) {
        if (!httpRequest.body[field])
          return badRequest(new MissingFieldError(field))
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body

      if (password !== passwordConfirmation)
        return badRequest(new InvalidFieldError('passwordConfirmation'))

      const emailIsValid = this.emailValidatorAdapter.isValid(email)
      if (!emailIsValid) return badRequest(new InvalidFieldError('email'))

      const addAccountDTO: IAddAccountDTO = { name, email, password }

      this.addAccountUseCase.addAccount(addAccountDTO)

      return {
        statusCode: 201,
      }
    } catch (error) {
      console.error(error)
      return serverError()
    }
  }
}
