import { IErrorLoggerRepository } from '../../../../data/interfaces/dependencies/protocols/error-logger-repository-protocol'
import { MongoDBHelper } from '../helpers/mongodb-helper'

export class LoggerRepository implements IErrorLoggerRepository {
  async logError(stack: string): Promise<void> {
    const collection = await MongoDBHelper.instance.getCollection('errors')
    await collection.insertOne({
      stack,
      createdAt: Date.now(),
    })
  }
}
