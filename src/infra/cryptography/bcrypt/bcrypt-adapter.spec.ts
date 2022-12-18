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

  test('Should throws an error if Bcrypt throws an error', async () => {
    const sut: IEncrypterAdapter = new BcryptAdapter(12)
    jest
      .spyOn(Bcrypt, 'hash')
      .mockImplementationOnce(async (): Promise<never> => Promise.reject(new Error()))

    const hash = sut.encrypt('data')

    await expect(hash).rejects.toThrow()
  })

  test('Should return a hash if all steps have been successful', async () => {
    const sut: IEncrypterAdapter = new BcryptAdapter(12)

    const hash = await sut.encrypt('data')

    expect(hash).toBe('hash')
  })
})
