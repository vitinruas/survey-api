import request from 'supertest'
import { MongoDBHelper } from '../../../../infra/repository/mongodb/helpers/mongodb-helper'
import { app } from '../../app'

describe('SignUpRoute', () => {
  const mongodb = MongoDBHelper.instance
  beforeAll(async () => {
    await mongodb.connect()
  })

  afterAll(async () => {
    await mongodb.disconnect()
  })

  beforeEach(async () => {
    const collection = await mongodb.getCollection('accounts')
    await collection.deleteMany({})
  })
  test('Should return an account whether all steps have been successful', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      })
      .expect(201)
  })
})
