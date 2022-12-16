import {
  IAddAccountUseCase,
  IAddAccountDTO,
  IAccountEntitie,
  IEncrypterAdapter,
  IAddAccountRepository,
} from './create-account-usecase-dependencies'

export class CreateAccountUseCase implements IAddAccountUseCase {
  constructor(
    private readonly encrypterAdapter: IEncrypterAdapter,
    private readonly addAccountRepository: IAddAccountRepository
  ) {}

  async addAccount(account: IAddAccountDTO): Promise<IAccountEntitie> {
    const password: string = await this.encrypterAdapter.encrypt(account.password)
    const createdAccount = await this.addAccountRepository.addAccount(
      Object.assign({}, account, { password })
    )
    return createdAccount
  }
}
