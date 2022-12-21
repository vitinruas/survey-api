import { CreateAccountUseCase } from '../../../data/usecase/account/create/create-account-usecase'
import { BcryptAdapter } from '../../../infra/cryptography/bcrypt/bcrypt-adapter'
import { MongoDBAccountRepository } from '../../../infra/repository/mongodb/account/mongodb-account-repository'
import { MongoDBHelper } from '../../../infra/repository/mongodb/helpers/mongodb-helper'
import { SignUpController } from '../../../presentation/controllers/account/signup/signup-controller'
import { IController } from '../../../presentation/interfaces'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'
import { LogControllerDecorator } from '../../decorators/log-decorator'

const signUpControllerCompositionFactory = (): IController => {
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const mongo = MongoDBHelper.instance
  const addAccountRepository = new MongoDBAccountRepository(mongo)
  const bcryptAdapter = new BcryptAdapter(12)
  const createAccountUseCase = new CreateAccountUseCase(bcryptAdapter, addAccountRepository)
  const signUpController = new SignUpController(emailValidatorAdapter, createAccountUseCase)
  const logControllerDecorator = new LogControllerDecorator(signUpController)
  return logControllerDecorator
}

export { signUpControllerCompositionFactory }
