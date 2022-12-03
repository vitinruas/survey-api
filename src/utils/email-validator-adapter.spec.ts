import { EmailValidatorAdapter } from './email-validator-adapter'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail(): boolean {
    return true
  },
}))

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter()
}

describe('EmailValidatorAdapter', () => {
  test('Should returns false if an invalid email is provided', () => {
    const sut: EmailValidatorAdapter = makeSut()
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)

    const isValid: boolean = sut.isValid('invalid_email@mail.com')

    expect(isValid).toBe(false)
  })

  test('Should returns true if a valid email is provided', () => {
    const sut: EmailValidatorAdapter = makeSut()

    const isValid: boolean = sut.isValid('valid_email@mail.com')

    expect(isValid).toBe(true)
  })

  test('Should call Validator.isEmail with correct value', () => {
    const sut: EmailValidatorAdapter = makeSut()
    const isEmailSpy = jest.spyOn(validator, 'isEmail')

    sut.isValid('any_email@mail.com')

    expect(isEmailSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
})
