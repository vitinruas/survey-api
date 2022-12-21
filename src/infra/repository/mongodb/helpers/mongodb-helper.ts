import { Collection, MongoClient, ObjectId } from 'mongodb'

class MongoDBHelper {
  private client: MongoClient | null = null
  private static _instance: MongoDBHelper | null = null

  private constructor() {}

  static get instance(): MongoDBHelper {
    if (!this._instance) {
      this._instance = new MongoDBHelper()
    }
    return this._instance
  }

  async connect(url: string): Promise<void> {
    this.client = await MongoClient.connect(url)
  }

  async isConnected(): Promise<boolean> {
    try {
      const isConnected = await this.client?.db().admin().ping()
      return !!isConnected
    } catch (error) {}
    return false
  }

  async disconnect(): Promise<void> {
    await this.client?.close()
  }

  async getCollection(collectionName: string): Promise<Collection> {
    const isConnected = await this.isConnected()
    if (!isConnected) await this.connect(process.env.MONGO_URL as string)
    return this.client?.db().collection(collectionName) as Collection
  }

  createObjectID(id?: string): ObjectId {
    return id ? new ObjectId(id) : new ObjectId()
  }

  changeMongoID(document: any): any {
    const { _id, ...data } = document
    return Object.assign(data, { id: _id })
  }

  // this method is exclusive to create an object to be used by mongodb method to exclude fields from a document
  createObjectFromArray(array: string[], fieldValue: any = 0): any {
    const obj = Object.create({})
    array.forEach((element: string) => {
      obj[element] = fieldValue
    })
    return obj
  }
}

export { MongoDBHelper }
