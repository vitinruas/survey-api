import {
  MissingFieldError,
  InvalidFieldError,
  ServerError,
} from '../../../errors'
import { SignUpController } from './signup-controller'
import {
  IHttpRequest,
  IHttpResponse,
  IEmailValidatorAdapter,
  IAddAccountUseCase,
  IAddAccountDTO,
  IAccountEntitie,
} from './signup-controller-protocols'

const makeEmailValidatorStub = (): IEmailValidatorAdapter => {
  class EmailValidatorStub {
    isValid(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeAddAccountUseCaseStub = (): IAddAccountUseCase => {
  class AddAccountUseCase implements IAddAccountUseCase {
    addAccount(addAccountDTO: IAddAccountDTO): IAccountEntitie {
      const createdFakeAccount: IAccountEntitie = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password',
        created_at: new Date('2001-01-01 00:00'),
        updated_at: new Date('2001-01-01 00:00'),
      }

      return createdFakeAccount
    }
  }
  return new AddAccountUseCase()
}

interface ISut {
  sut: SignUpController
  emailValidatorStub: IEmailValidatorAdapter
  addAccountUseCaseStub: IAddAccountUseCase
}

const makeSut = (): ISut => {
  const emailValidatorStub: IEmailValidatorAdapter = makeEmailValidatorStub()
  const addAccountUseCaseStub: IAddAccountUseCase = makeAddAccountUseCaseStub()
  const sut: SignUpController = new SignUpController(
    emailValidatorStub,
    addAccountUseCaseStub
  )
  return {
    sut,
    emailValidatorStub,
    addAccountUseCaseStub,
  }
}

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', () => {
    const { sut }: ISut = makeSut()
    const httpRequest: IHttpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }

    const httpResponse: IHttpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingFieldError('name'))
  })

  test('Should return 400 if no email is provided', () => {
    const { sut }: ISut = makeSut()
    const httpRequest: IHttpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }

    const httpResponse: IHttpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingFieldError('email'))
  })

  test('Should return 400 if no password is provided', () => {
    const { sut }: ISut = makeSut()
    const httpRequest: IHttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        passwordConfirmation: 'any_password',
      },
    }

    const httpResponse: IHttpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingFieldError('password'))
  })

  test('Should return 400 if no passwordConfirmation is provided', () => {
    const { sut }: ISut = makeSut()
    const httpRequest: IHttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
      },
    }

    const httpResponse: IHttpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(
      new MissingFieldError('passwordConfirmation')
    )
  })

  test('Should return 400 if provided passwords do not match', () => {
    const { sut }: ISut = makeSut()
    const httpRequest: IHttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'different_password',
      },
    }

    const httpResponse: IHttpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(
      new InvalidFieldError('passwordConfirmation')
    )
  })

  test('Should call EmailValidatorAdapter with correct information', () => {
    const { sut, emailValidatorStub }: ISut = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest: IHttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }

    sut.handle(httpRequest)

    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Should return 400 if an invalid email is provided', () => {
    const { sut, emailValidatorStub }: ISut = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest: IHttpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }

    const httpResponse: IHttpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidFieldError('email'))
  })

  test('Should return 500 if EmailValidatorAdapter throws an error', () => {
    const { sut, emailValidatorStub }: ISut = makeSut()
    // we are changing a mocked class method to throw an error.
    jest
      .spyOn(emailValidatorStub, 'isValid')
      .mockImplementationOnce((): never => {
        throw new Error()
      })
    const httpRequest: IHttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }

    const httpResponse: IHttpResponse = sut.handle(httpRequest)

    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should call AddAccountUseCase with correct information', () => {
    const { sut, addAccountUseCaseStub }: ISut = makeSut()
    const addAccountSpy = jest.spyOn(addAccountUseCaseStub, 'addAccount')
    const httpRequest: IHttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }

    sut.handle(httpRequest)

    expect(addAccountSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
    })
  })

  test('Should return 500 if AddAccountUseCase throws an error', () => {
    const { sut, addAccountUseCaseStub }: ISut = makeSut()
    // we are changing a mocked class method to throw an error.
    jest
      .spyOn(addAccountUseCaseStub, 'addAccount')
      .mockImplementationOnce((): never => {
        throw new Error()
      })
    const httpRequest: IHttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }

    const httpResponse: IHttpResponse = sut.handle(httpRequest)

    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should call AddAccountUseCase with correct information', () => {
    const { sut }: ISut = makeSut()
    const httpRequest: IHttpRequest = {
      body: {
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password',
        passwordConfirmation: 'valid_password',
      },
    }

    const createdAccount: IAccountEntitie = {
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password',
      created_at: new Date('2001-01-01 00:00'),
      updated_at: new Date('2001-01-01 00:00'),
    }

    const response: IHttpResponse = sut.handle(httpRequest)
    expect(response).toEqual({
      statusCode: 201,
      body: createdAccount,
    })
  })
})
