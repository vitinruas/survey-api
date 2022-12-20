import { Router } from 'express'
import { routeAdapter } from '../../../adapters/express-route-adapter'
import { signUpControllerCompositionFactory } from '../../../compositions/account/signup-controller-composition'

export default (router: Router): void => {
  router.post('/signup', routeAdapter(signUpControllerCompositionFactory()))
}
