import { IController, IHttpRequest, IHttpResponse } from '../../presentation/interfaces'

class LogControllerDecorator implements IController {
  constructor(private readonly controller: IController) {}
  async handle(request: IHttpRequest): Promise<IHttpResponse> {
    await this.controller.handle(request)
    return {
      statusCode: 200,
      body: {},
    }
  }
}

export { LogControllerDecorator }
