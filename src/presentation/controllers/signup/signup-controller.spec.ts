import { SignUpController } from './signup-controller'
import { IController } from '../../protocols/controller-protocol'
import { IHttpRequest, IHttpResponse } from '../../protocols/http-protocol'
import { MissingFieldError } from '../../errors/missing-field-error'

describe('SignUp Controller', () => {
  test('Should return 400 if no name is provided', () => {
    const sut: IController = new SignUpController()
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
    const sut: IController = new SignUpController()
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
    const sut: IController = new SignUpController()
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
    const sut: IController = new SignUpController()
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
})
