import { EmailValidatorAdapter } from './email-validator-adapter'

describe('EmailValidatorAdapter', () => {
  test('Should returns false if an invalid email is provided', () => {
    const sut = new EmailValidatorAdapter()
    const isValid: boolean = sut.isValid('invalid_email@mail.com')

    expect(isValid).toBe(false)
  })
})
