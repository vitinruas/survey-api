import { IEncrypterAdapter } from '../../../data/usecase/account/create-account-usecase-dependencies'
import Bcrypt from 'bcrypt'

export class BcryptAdapter implements IEncrypterAdapter {
  constructor(private readonly salt: number) {}
  async encrypt(value: string): Promise<string> {
    await Bcrypt.hash(value, this.salt)
    return Promise.resolve('')
  }
}
