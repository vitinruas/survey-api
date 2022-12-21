import { MongoDBHelper } from './mongodb-helper'

describe('MongoDBHelper', () => {
  const mongo = MongoDBHelper.instance
  beforeAll(async () => {
    await mongo.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await mongo.disconnect()
  })
  test('Should call MongoDBHelper.connect if there is no connection opened when get a collection', async () => {
    jest.spyOn(mongo, 'isConnected').mockImplementationOnce(async () => false)
    const connectSpy = jest.spyOn(mongo, 'connect')

    await mongo.getCollection('accounts')

    expect(connectSpy).toHaveBeenCalled()
  })
})
