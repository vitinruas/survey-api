import { IAccountEntitie } from './mongodb-account-repository-dependencies'
import { MongoDBHelper } from '../helpers/mongodb-helper'
import { MongoDBAccountRepository } from './mongodb-account-repository'

describe('MongoDBAccountRepository', () => {
  const mongodb = MongoDBHelper.instance
  beforeAll(async () => {
    await mongodb.connect(process.env.MONGO_URL as string)
  })

  afterAll(async () => {
    await mongodb.disconnect()
  })

  beforeEach(async () => {
    const collection = mongodb.getCollection('accounts')
    await collection.deleteMany({})
  })

  test('Should return an account wheter all steps have been successful', async () => {
    const sut = new MongoDBAccountRepository(mongodb)

    const account: IAccountEntitie = await sut.addAccount({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
    })

    expect(account).toBeTruthy()
    expect(account.id).toBeTruthy()
    expect(account.name).toBe('any_name')
    expect(account.email).toBe('any_email@mail.com')
    expect(account.created_at).toBeTruthy()
    expect(account.updated_at).toBeTruthy()
  })
})
