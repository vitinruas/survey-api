import { Request, Response } from 'express'
import { IController, IHttpRequest, IHttpResponse } from '../../presentation/interfaces'

const routeAdapter = (controller: IController) => {
  return async (req: Request, res: Response) => {
    const httpRequest: IHttpRequest = {
      body: req.body,
    }
    const httpResponse: IHttpResponse = await controller.handle(httpRequest)
    if (httpResponse.statusCode >= 400) {
      return res.status(httpResponse.statusCode).json(httpResponse.body.message)
    }
    return res.status(httpResponse.statusCode).json(httpResponse.body)
  }
}

export { routeAdapter }
