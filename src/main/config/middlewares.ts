import { Express } from 'express'
import { bodyParserMiddleware } from './middlewares/bodyparser/body-parser-middleware'
import { corsMiddleware } from './middlewares/cors/cors-middleware'

const middlewares = (app: Express): void => {
  app.use(bodyParserMiddleware)
  app.use(corsMiddleware)
}
export { middlewares }
