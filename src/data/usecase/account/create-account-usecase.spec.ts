import { IAddAccountDTO } from '../../../domain/dtos/add-account-dto'
import { IEncrypterAdapter } from '../../interfaces/dependencies/account/encrypter-adapter'
import { CreateAccountUseCase } from './create-account-usecase'

describe('CreateAccountUseCase', () => {
  test('Should call Encrypter with correct information', async () => {
    class EncrypterStub implements IEncrypterAdapter {
      async encrypt(value: string): Promise<string> {
        return Promise.resolve('hashed_password')
      }
    }
    const encrypterStub = new EncrypterStub()
    const sut = new CreateAccountUseCase(encrypterStub)
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const accountData: IAddAccountDTO = {
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'valid_password',
    }

    await sut.addAccount(accountData)
    expect(encryptSpy).toHaveBeenCalledWith('valid_password')
  })
})
