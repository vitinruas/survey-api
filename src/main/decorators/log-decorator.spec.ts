import { IController, IHttpRequest, IHttpResponse } from '../../presentation/interfaces'
import { LogControllerDecorator } from './log-decorator'

const makeController = (): IController => {
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
  controller: IController
  sut: LogControllerDecorator
}

const makeSut = (): ISut => {
  const controller: IController = makeController()
  const sut: LogControllerDecorator = new LogControllerDecorator(controller)
  return {
    controller,
    sut,
  }
}
describe('LogControllerDecorator', () => {
  test('Should call Controller with correct information', async () => {
    const { sut, controller } = makeSut()
    const handleSpy = jest.spyOn(controller, 'handle')
    const httpRequest = {
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
})
