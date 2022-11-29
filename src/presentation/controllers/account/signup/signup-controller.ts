import { badRequest, serverError } from '../../../helper/http-helper'
import { MissingFieldError, InvalidFieldError } from '../../../errors'
import {
  IController,
  IHttpRequest,
  IHttpResponse,
  IEmailValidatorAdapter,
  IAddAccountUseCase,
  IAddAccountDTO,
  IAccountEntitie,
} from './signup-controller-protocols'

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

      // check if all required fields have been provided
      for (const field of requiredFields) {
        if (!httpRequest.body[field])
          return badRequest(new MissingFieldError(field))
      }

      const { name, email, password, passwordConfirmation } = httpRequest.body

      // check if provided passwords match
      if (password !== passwordConfirmation)
        return badRequest(new InvalidFieldError('passwordConfirmation'))

      // check if provided email is valid
      const emailIsValid = this.emailValidatorAdapter.isValid(email)
      if (!emailIsValid) return badRequest(new InvalidFieldError('email'))

      // call a method class which knows how to create an user account
      const addAccountDTO: IAddAccountDTO = { name, email, password }
      const createdAccount: IAccountEntitie =
        this.addAccountUseCase.addAccount(addAccountDTO)
      return {
        statusCode: 201,
        body: createdAccount,
      }
    } catch (error) {
      console.error(error)
      return serverError()
    }
  }
}
