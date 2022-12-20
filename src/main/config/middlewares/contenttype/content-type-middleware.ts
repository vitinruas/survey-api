import { NextFunction, Request, Response } from 'express'

const contentTypeMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  res.type('json')
  return next()
}

export { contentTypeMiddleware }
