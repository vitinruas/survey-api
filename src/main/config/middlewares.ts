import { Express } from 'express'
import { bodyParserMiddleware } from './middlewares/bodyparser/body-parser-middleware'
import { contentTypeMiddleware } from './middlewares/contenttype/content-type-middleware'
import { corsMiddleware } from './middlewares/cors/cors-middleware'

const middlewares = (app: Express): void => {
  app.use(bodyParserMiddleware)
  app.use(corsMiddleware)
  app.use(contentTypeMiddleware)
}
export { middlewares }
