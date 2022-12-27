export interface IErrorLoggerRepository {
  logError: (stack: string) => Promise<void>
}
