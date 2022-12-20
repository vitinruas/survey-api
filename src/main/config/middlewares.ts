import { Express } from 'express'
import { bodyParserMiddleware } from './middlewares/bodyparser/body-parser-middleware'

const middlewares = (app: Express): void => {
  app.use(bodyParserMiddleware)
}
export { middlewares }
