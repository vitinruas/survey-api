import { SignUpController } from './signup-controller'
import { IHttpRequest, IHttpResponse } from '../../interfaces/protocols/http-protocol'
import { MissingFieldError } from '../../errors/missing-field-error'
import { InvalidFieldError } from '../../errors/invalid-field-error'
import { IEmailValidatorAdapter } from '../../interfaces/dependencies/email-validator-adapter-dependency'

interface ISut {
  sut: SignUpController,
  emailValidatorStub: IEmailValidatorAdapter
}

const makeSut = (): ISut => {
  class EmailValidatorStub {
    isValid (email: string): boolean {
      return true
    }
  }
  const emailValidatorStub: IEmailValidatorAdapter = new EmailValidatorStub()
  const sut: SignUpController = new SignUpController(emailValidatorStub)
  return {
    sut,
    emailValidatorStub
  }
}

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', () => {
    const {sut }: ISut = makeSut()
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
    const {sut }: ISut = makeSut()
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
    const {sut }: ISut = makeSut()
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
    const {sut }: ISut = makeSut()
    const httpRequest: IHttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
      },
    }

    const httpResponse: IHttpResponse = sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingFieldError('passwordConfirmation'))
  })
  test('Should return 400 if an invalid email is provided', () => {
    const {sut, emailValidatorStub }: ISut = makeSut()
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
  test('Should call EmailValidatorAdapter with correct information', () => {
    const {sut, emailValidatorStub }: ISut = makeSut()
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
})
