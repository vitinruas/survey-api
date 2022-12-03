import { IEmailValidatorAdapter } from '../presentation/interfaces/dependencies/email-validator-adapter-dependency'

export class EmailValidatorAdapter implements IEmailValidatorAdapter {
  isValid(email: string): boolean {
    return false
  }
}
