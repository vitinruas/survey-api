/* eslint-disable @typescript-eslint/no-floating-promises */
import { MongoDBHelper } from '../infra/repository/mongodb/helpers/mongodb-helper'
import { config } from 'dotenv'
config()

const port = 8000
const mongo = MongoDBHelper.instance
mongo
  .connect(process.env.MONGO_URL as string)
  .then(async (): Promise<void> => {
    const app = (await import('./config/app')).app
    app.listen(port, async () => {
      console.log(`API running at http://localhost:${port}`)
    })
  })
  .catch((err) => {
    console.error('ERROR: Unable to connect to database\n', err)
  })
