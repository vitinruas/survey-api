import { IAddAccountDTO } from '../../../domain/dtos/add-account-dto'
import { IAccountEntitie } from '../../../domain/entities/account-entitie'
import { IAddAccountUseCase } from '../../../domain/usecase/add-account-usecase'
import { IEncrypterAdapter } from '../../interfaces/dependencies/account/encrypter-adapter-dependency'

export class CreateAccountUseCase implements IAddAccountUseCase {
  constructor(private readonly encrypterAdapter: IEncrypterAdapter) {}
  async addAccount(account: IAddAccountDTO): Promise<IAccountEntitie> {
    await this.encrypterAdapter.encrypt(account.password)
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
