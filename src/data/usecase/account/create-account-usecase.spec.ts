import { IAddAccountDTO } from '../../../domain/dtos/add-account-dto'
import { IEncrypterAdapter } from '../../interfaces/dependencies/account/encrypter-adapter'
import { CreateAccountUseCase } from './create-account-usecase'

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
  test('Should call Encrypter with correct information', async () => {
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
})
