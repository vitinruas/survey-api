import request from 'supertest'
import { app } from '../../app'

describe('CorsMiddleware', () => {
  test('Should enable cors for external requests', async () => {
    app.get('/test_cors', (req, res) => {
      res.send()
    })
    await request(app).post('/test_cors').expect('access-control-allow-origin', '*')
  })
})
