import { IErrorLoggerRepository } from '../../data/interfaces/dependencies/protocols/error-logger-repository-protocol'
import { serverError } from '../../presentation/helper/http-helper'
import { IController, IHttpRequest, IHttpResponse } from '../../presentation/interfaces'
import { LogControllerDecorator } from './log-decorator'

const makeLoggerRepositoryStub = (): IErrorLoggerRepository => {
  class LoggerRepositoryStub implements IErrorLoggerRepository {
    async logError(stack: string): Promise<void> {
      return Promise.resolve()
    }
  }
  return new LoggerRepositoryStub()
}

const makeControllerStub = (): IController => {
  class ControllerStub implements IController {
    async handle(request: IHttpRequest): Promise<IHttpResponse> {
      return makeFakeResponse()
    }
  }
  return new ControllerStub()
}

interface ISut {
  controllerStub: IController
  loggerRepositoryStub: IErrorLoggerRepository
  sut: LogControllerDecorator
}

const makeSut = (): ISut => {
  const controllerStub: IController = makeControllerStub()
  const loggerRepositoryStub: IErrorLoggerRepository = makeLoggerRepositoryStub()
  const sut: LogControllerDecorator = new LogControllerDecorator(controllerStub, loggerRepositoryStub)
  return {
    controllerStub,
    loggerRepositoryStub,
    sut,
  }
}

const makeFakeRequest = (): IHttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password',
  },
})

const makeFakeResponse = (): IHttpResponse => ({
  statusCode: 200,
  body: {},
})

const makeFakeServerError = (): Error => {
  const fakeError = new Error()
  fakeError.stack = 'any_stack'
  return fakeError
}

describe('LogControllerDecorator', () => {
  test('Should call Controller with correct information', async () => {
    const { sut, controllerStub }: ISut = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')

    await sut.handle(makeFakeRequest())

    expect(handleSpy).toHaveBeenCalledWith(makeFakeRequest())
  })

  test('Should return the same result of the controller', async () => {
    const { sut }: ISut = makeSut()

    const httpResponse: IHttpResponse = await sut.handle(makeFakeRequest())

    expect(httpResponse).toEqual(makeFakeResponse())
  })

  test('Should call LoggerRepository with correct information', async () => {
    const { sut, controllerStub, loggerRepositoryStub }: ISut = makeSut()

    jest
      .spyOn(controllerStub, 'handle')
      .mockImplementationOnce(async () => Promise.resolve(serverError(makeFakeServerError())))
    const logSpy = jest.spyOn(loggerRepositoryStub, 'logError')

    await sut.handle(makeFakeRequest())

    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
