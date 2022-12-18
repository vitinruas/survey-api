import { IEncrypterAdapter } from '../../../data/usecase/account/create-account-usecase-dependencies'
import { BcryptAdapter } from './bcrypt-adapter'
import Bcrypt from 'bcrypt'

jest.mock('Bcrypt', () => ({
  async hash() {
    return Promise.resolve('hash')
  },
}))

describe('Bcrypt Adapter', () => {
  test('Should call Bcrypt with correct information', async () => {
    const sut: IEncrypterAdapter = new BcryptAdapter(12)
    const hashSpy = jest.spyOn(Bcrypt, 'hash')

    await sut.encrypt('data')

    expect(hashSpy).toHaveBeenCalledWith('data', 12)
  })
})
