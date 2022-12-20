import { Request, Response, Router } from 'express'

export default (router: Router): void => {
  router.post('/signup', (req: Request, res: Response) => {
    return res.status(201).json({
      id: 'any_id',
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'hashed_password',
      createdAt: new Date().getTime(),
      updatedAt: new Date().getTime(),
    })
  })
}
