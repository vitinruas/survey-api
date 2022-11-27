export class ServerError extends Error {
  constructor() {
    super(`Unexpected Internal Error`)
    this.name = 'ServerError'
  }
}
