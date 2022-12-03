import { IEmailValidatorAdapter } from '../presentation/interfaces/dependencies/email-validator-adapter-dependency'
import validator from 'validator'

export class EmailValidatorAdapter implements IEmailValidatorAdapter {
  isValid(email: string): boolean {
    return validator.isEmail(email)
  }
}
