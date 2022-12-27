/* eslint-disable @typescript-eslint/no-floating-promises */
import { MongoDBHelper } from '../infra/repository/mongodb/helpers/mongodb-helper'
import { config } from 'dotenv'
config()

const port = process.env.PORT as string
const mongo = MongoDBHelper.instance
mongo
  .connect(process.env.MONGO_URL as string)
  .then(async (): Promise<void> => {
    console.log(`OK -> Connected to DataBase`)
    const app = (await import('./config/app')).app
    app.listen(port, async () => {
      console.log(`OK -> API running at http://localhost:${port}`)
      console.log('CTRL + C to stop running')
    })
  })
  .catch((err) => {
    console.error('ERROR -> Unable to connect to database:', err)
  })
