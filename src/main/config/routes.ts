import { Express, Router } from 'express'
import fastGlob from 'fast-glob'

const routes = (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  const routeFilePaths = fastGlob.sync('src/main/config/routes/**/*route.ts')
  routeFilePaths.map(async (filePath: string): Promise<void> => {
    ;(await import('../../../' + filePath)).default(router) // call export default function of each route file
  })
}
export { routes }
