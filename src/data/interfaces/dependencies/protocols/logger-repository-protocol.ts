export interface ILoggerRepository {
  logError: (stack: string) => Promise<void>
}
