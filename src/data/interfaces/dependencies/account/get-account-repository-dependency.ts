import { IAccountEntitie } from '../../../../domain/entities/account-entitie'

export interface FieldToLookUp {
  key: keyof Omit<IAccountEntitie, 'password'> | '_id'
  value: any
}

export type TypeFieldsToRemove = Array<keyof IAccountEntitie>

export interface IGetAccountRepository {
  getAccount: (
    fieldToLookUp: FieldToLookUp,
    fieldsToRemove?: TypeFieldsToRemove
  ) => Promise<IAccountEntitie | null>
}
