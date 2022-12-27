import { Collection } from 'mongodb'
import { MongoDBHelper } from '../helpers/mongodb-helper'
import { LoggerRepository } from './logger-repository'

describe('MongoDBHelper', () => {
  const mongo = MongoDBHelper.instance
  let collection: Collection
  beforeAll(async () => {
    collection = await mongo.getCollection('errors')
    await mongo.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await mongo.disconnect()
    await collection.deleteMany({})
  })
  test('Should add an error log if something go wrong', async () => {
    const sut = new LoggerRepository()
    await sut.logError('any_stack')

    const numberOfDocuments = await collection.countDocuments()

    expect(numberOfDocuments).toBe(1)
  })
})
