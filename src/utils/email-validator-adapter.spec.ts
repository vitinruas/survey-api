import { EmailValidatorAdapter } from './email-validator-adapter'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail(): boolean {
    return true
  },
}))

describe('EmailValidatorAdapter', () => {
  test('Should returns false if an invalid email is provided', () => {
    const sut = new EmailValidatorAdapter()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const isValid: boolean = sut.isValid('invalid_email@mail.com')
    expect(isValid).toBe(false)
  })

  test('Should returns true if a valid email is provided', () => {
    const sut = new EmailValidatorAdapter()
    const isValid: boolean = sut.isValid('invalid_email@mail.com')

    expect(isValid).toBe(true)
  })
})
