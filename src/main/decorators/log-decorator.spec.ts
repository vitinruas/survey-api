import { IController, IHttpRequest, IHttpResponse } from '../../presentation/interfaces'
import { LogControllerDecorator } from './log-decorator'

describe('LogControllerDecorator', () => {
  test('Should call Controller with correct information', async () => {
    class ControllerStub implements IController {
      async handle(request: IHttpRequest): Promise<IHttpResponse> {
        return {
          statusCode: 200,
          body: {},
        }
      }
    }
    const controller = new ControllerStub()
    const sut = new LogControllerDecorator(controller)
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
