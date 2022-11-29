import { IAddAccountDTO } from '../dtos/add-account-dto'
import { IAccountEntitie } from '../entities/account-entitie'

export interface IAddAccountUseCase {
  addAccount: (account: IAddAccountDTO) => Promise<IAccountEntitie>
}
