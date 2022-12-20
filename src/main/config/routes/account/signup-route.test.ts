import request from 'supertest'
import { app } from '../../app'

describe('SignUpRoute', () => {
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
