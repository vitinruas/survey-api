export interface IEmailValidatorAdapter {
  isValid: (email: string) => boolean
}
