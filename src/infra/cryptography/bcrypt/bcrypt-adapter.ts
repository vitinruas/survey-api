import { IEncrypterAdapter } from '../../../data/usecase/account/create/create-account-usecase-dependencies'
import Bcrypt from 'bcrypt'

export class BcryptAdapter implements IEncrypterAdapter {
  constructor(private readonly salt: number) {}
  async encrypt(value: string): Promise<string> {
    const hash = await Bcrypt.hash(value, this.salt)
    return hash
  }
}
