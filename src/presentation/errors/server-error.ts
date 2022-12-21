export class ServerError extends Error {
  constructor(stack: string) {
    super(`Unexpected Internal Error`)
    this.name = 'ServerError'
    this.stack = stack
  }
}
