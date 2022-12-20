import request from 'supertest'
import { app } from '../../app'

describe('CorsMiddleware', () => {
  test('Should parse body request to json', async () => {
    app.post('/test_parse_body', (req, res) => {
      return res.send(req.body)
    })
    await request(app)
      .post('/test_parse_body')
      .send({ name: 'any_name' })
      .expect({ name: 'any_name' })
  })
})
