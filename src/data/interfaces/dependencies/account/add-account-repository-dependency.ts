import { IAddAccountModel } from '../../../../domain/models/add-account-model'
import { IAccountEntitie } from '../../../usecase/account/create/create-account-usecase-dependencies'

export interface IAddAccountRepository {
  addAccount: (account: IAddAccountModel) => Promise<IAccountEntitie>
}
