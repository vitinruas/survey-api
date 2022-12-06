import {
  IAddAccountUseCase,
  IAddAccountDTO,
  IAccountEntitie,
  IEncrypterAdapter,
} from './create-account-usecase-dependencies'

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
