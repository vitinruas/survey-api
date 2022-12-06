import { CreateAccountUseCase } from './create-account-usecase'
import {
  IAddAccountDTO,
  IAccountEntitie,
  IEncrypterAdapter,
} from './create-account-usecase-dependencies'

const makeEncrypterAdapterStub = (): IEncrypterAdapter => {
  class EncrypterAdapterStub implements IEncrypterAdapter {
    async encrypt(value: string): Promise<string> {
      return Promise.resolve('hashed_password')
    }
  }
  return new EncrypterAdapterStub()
}

interface ISut {
  encrypterAdapterStub: IEncrypterAdapter
  sut: CreateAccountUseCase
}

const makeSut = (): ISut => {
  const encrypterAdapterStub: IEncrypterAdapter = makeEncrypterAdapterStub()
  const sut = new CreateAccountUseCase(encrypterAdapterStub)
  return {
    sut,
    encrypterAdapterStub,
  }
}

describe('CreateAccountUseCase', () => {
  test('Should call EncrypterAdapter with correct information', async () => {
    const { sut, encrypterAdapterStub } = makeSut()
    const encryptSpy = jest.spyOn(encrypterAdapterStub, 'encrypt')
    const accountData: IAddAccountDTO = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password',
    }

    await sut.addAccount(accountData)

    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })

  test('Should throw an error if EncrypterAdapter throws an error', async () => {
    const { sut, encrypterAdapterStub } = makeSut()
    jest
      .spyOn(encrypterAdapterStub, 'encrypt')
      .mockImplementationOnce(
        async (): Promise<never> => Promise.reject(new Error())
      )
    const accountData: IAddAccountDTO = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password',
    }

    const throwAccount: Promise<IAccountEntitie> = sut.addAccount(accountData)
    await expect(throwAccount).rejects.toThrow()
  })
})
