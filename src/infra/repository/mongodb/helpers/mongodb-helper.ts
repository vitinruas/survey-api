import { MongoClient } from 'mongodb'

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
    this.client = await MongoClient.connect(process.env.MONGO_URL as string)
  }

  async disconnect(): Promise<void> {
    await this.client?.close()
  }
}

export { MongoDBHelper }
