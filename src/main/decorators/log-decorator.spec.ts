import { ILoggerRepository } from '../../data/interfaces/dependencies/protocols/logger-repository-protocol'
import { serverError } from '../../presentation/helper/http-helper'
import { IController, IHttpRequest, IHttpResponse } from '../../presentation/interfaces'
import { LogControllerDecorator } from './log-decorator'

const makeLoggerRepositoryStub = (): ILoggerRepository => {
  class LoggerRepositoryStub implements ILoggerRepository {
    async logError(stack: string): Promise<void> {
      return Promise.resolve()
    }
  }
  return new LoggerRepositoryStub()
}

const makeControllerStub = (): IController => {
  class ControllerStub implements IController {
    async handle(request: IHttpRequest): Promise<IHttpResponse> {
      return {
        statusCode: 200,
        body: {},
      }
    }
  }
  return new ControllerStub()
}

interface ISut {
  controllerStub: IController
  loggerRepositoryStub: ILoggerRepository
  sut: LogControllerDecorator
}

const makeSut = (): ISut => {
  const controllerStub: IController = makeControllerStub()
  const loggerRepositoryStub: ILoggerRepository = makeLoggerRepositoryStub()
  const sut: LogControllerDecorator = new LogControllerDecorator(
    controllerStub,
    loggerRepositoryStub
  )
  return {
    controllerStub,
    loggerRepositoryStub,
    sut,
  }
}
describe('LogControllerDecorator', () => {
  test('Should call Controller with correct information', async () => {
    const { sut, controllerStub }: ISut = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    const httpRequest: IHttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }

    await sut.handle(httpRequest)

    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })

  test('Should return the same result of the controller', async () => {
    const { sut }: ISut = makeSut()
    const httpRequest: IHttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }

    const httpResponse: IHttpResponse = await sut.handle(httpRequest)

    expect(httpResponse).toEqual({
      statusCode: 200,
      body: {},
    })
  })

  test('Should call LoggerRepository with correct information', async () => {
    const { sut, controllerStub, loggerRepositoryStub }: ISut = makeSut()
    const fakeError = new Error()
    fakeError.stack = 'any_stack'
    jest
      .spyOn(controllerStub, 'handle')
      .mockImplementationOnce(async () => Promise.resolve(serverError(fakeError)))
    const logSpy = jest.spyOn(loggerRepositoryStub, 'logError')
    const httpRequest: IHttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    }

    await sut.handle(httpRequest)

    expect(logSpy).toHaveBeenCalledWith('any_stack')
  })
})
