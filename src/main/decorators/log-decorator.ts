import { ILoggerRepository } from '../../data/interfaces/dependencies/protocols/logger-repository-protocol'
import { ServerError } from '../../presentation/errors'
import { IController, IHttpRequest, IHttpResponse } from '../../presentation/interfaces'

class LogControllerDecorator implements IController {
  constructor(
    private readonly controller: IController,
    private readonly loggerRepository: ILoggerRepository
  ) {}

  async handle(request: IHttpRequest): Promise<IHttpResponse> {
    const httpResponse: IHttpResponse = await this.controller.handle(request)
    if (httpResponse.body instanceof ServerError) {
      await this.loggerRepository.logError(httpResponse.body.stack as string)
    }
    return httpResponse
  }
}

export { LogControllerDecorator }
