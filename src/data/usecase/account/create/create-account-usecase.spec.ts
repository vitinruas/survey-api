import { CreateAccountUseCase } from './create-account-usecase'
import {
  IAddAccountDTO,
  IAccountEntitie,
  IEncrypterAdapter,
  IAddAccountRepository,
  IAddAccountModel,
} from './create-account-usecase-dependencies'

const makeEncrypterAdapterStub = (): IEncrypterAdapter => {
  class EncrypterAdapterStub implements IEncrypterAdapter {
    async encrypt(value: string): Promise<string> {
      return Promise.resolve('hashed_password')
    }
  }
  return new EncrypterAdapterStub()
}

const makeAddAccountRepositoryStub = (): IAddAccountRepository => {
  class AddAccountRepositoryStub implements IAddAccountRepository {
    async addAccount(account: IAddAccountModel): Promise<IAccountEntitie> {
      return Promise.resolve({
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@mail.com',
        password: 'valid_password',
        created_at: new Date('2001-01-01 00:00'),
        updated_at: new Date('2001-01-01 00:00'),
      })
    }
  }
  return new AddAccountRepositoryStub()
}

interface ISut {
  encrypterAdapterStub: IEncrypterAdapter
  addAccountRepositoryStub: IAddAccountRepository
  sut: CreateAccountUseCase
}

const makeSut = (): ISut => {
  const addAccountRepositoryStub: IAddAccountRepository = makeAddAccountRepositoryStub()
  const encrypterAdapterStub: IEncrypterAdapter = makeEncrypterAdapterStub()
  const sut = new CreateAccountUseCase(encrypterAdapterStub, addAccountRepositoryStub)
  return {
    sut,
    encrypterAdapterStub,
    addAccountRepositoryStub,
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
      .mockImplementationOnce(async (): Promise<never> => Promise.reject(new Error()))
    const accountData: IAddAccountDTO = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password',
    }

    const throwAccount: Promise<IAccountEntitie> = sut.addAccount(accountData)
    await expect(throwAccount).rejects.toThrow()
  })

  test('Should call AddAccountRepository with correct information', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addAccountSpy = jest.spyOn(addAccountRepositoryStub, 'addAccount')
    const accountData: IAddAccountDTO = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password',
    }

    await sut.addAccount(accountData)

    expect(addAccountSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'hashed_password',
    })
  })

  test('Should throw an error if AddAccountRepository throws an error', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest
      .spyOn(addAccountRepositoryStub, 'addAccount')
      .mockImplementationOnce(async (): Promise<never> => Promise.reject(new Error()))
    const accountData: IAddAccountDTO = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password',
    }

    const throwAccount: Promise<IAccountEntitie> = sut.addAccount(accountData)
    await expect(throwAccount).rejects.toThrow()
  })

  test('Should return an account if all steps succeeds', async () => {
    const { sut } = makeSut()
    const accountData: IAddAccountDTO = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password',
    }

    const createdAccount = await sut.addAccount(accountData)

    expect(createdAccount).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password',
      created_at: new Date('2001-01-01 00:00'),
      updated_at: new Date('2001-01-01 00:00'),
    })
  })
})