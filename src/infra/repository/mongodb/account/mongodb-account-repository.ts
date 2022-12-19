/* eslint-disable @typescript-eslint/consistent-type-assertions */
import { MongoDBHelper } from '../helpers/mongodb-helper'
import {
  FieldToLookUp,
  IAccountEntitie,
  IAddAccountModel,
  IAddAccountRepository,
  IGetAccountRepository,
  TypeFieldsToRemove,
} from './mongodb-account-repository-dependencies'

export class MongoDBAccountRepository implements IAddAccountRepository, IGetAccountRepository {
  constructor(private readonly mongodb: MongoDBHelper) {}
  async addAccount(account: IAddAccountModel): Promise<IAccountEntitie> {
    // insert a user and return their data
    const collection = this.mongodb.getCollection('accounts')
    const result = await collection.insertOne(
      Object.assign({
        _id: this.mongodb.createObjectID(),
        ...account,
        created_at: new Date().getTime(),
        updated_at: new Date().getTime(),
      })
    )

    const createdAccount: IAccountEntitie = (await this.getAccount(
      {
        key: '_id',
        value: result.insertedId,
      },
      ['password']
    )) as IAccountEntitie
    return createdAccount
  }

  async getAccount(
    fieldToLookUp: FieldToLookUp,
    fieldsToRemove?: TypeFieldsToRemove
  ): Promise<IAccountEntitie | null> {
    // look up user information from a collection
    const collection = this.mongodb.getCollection('accounts')

    // create a fields object to be removed
    if (fieldsToRemove?.length) {
      fieldsToRemove = this.mongodb.createObjectFromArray(fieldsToRemove)
    }

    const document = await collection
      .find(
        {
          [fieldToLookUp.key]: this.mongodb.createObjectID(fieldToLookUp.value),
        },
        { projection: fieldsToRemove ?? {} }
      )
      .toArray()
    // return document wheter it exists and change its id
    return (document[0] && this.mongodb.changeMongoID(document[0])) || null
  }
}
