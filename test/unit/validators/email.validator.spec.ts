import { assert } from 'chai'
import { EmailValidator } from '../../../src/application/domain/validator/email.validator'
import { ValidationException } from '../../../src/application/domain/exception/validation.exception'
import { Strings } from '../../../src/utils/strings'

describe('VALIDATORS: EmailValidator', () => {
    let email: string = 'valid_email@mail.com'

    afterEach(() => {
        email = 'valid_email@mail.com'
    })

    context('when the Email is valid', () => {
        it('should return undefined when the validation was successful', () => {
            try {
                const result = EmailValidator.validate(email)
                assert.isUndefined(result)
            } catch (err) {
                assert.fail(err)
            }
        })
    })

    context('when the email is invalid', () => {
        it('should throw ValidationException for invalid email: undefined', () => {
            try {
                email = undefined!
                EmailValidator.validate(email)
                assert.fail()
            } catch (err) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.VALIDATE.INVALID_EMAIL.replace('{0}', undefined))
            }
        })

        it('should throw ValidationException for invalid email: null', () => {
            try {
                email = null!
                EmailValidator.validate(email)
                assert.fail()
            } catch (err) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.VALIDATE.INVALID_EMAIL.replace('{0}', null))
            }
        })

        it('should throw ValidationException for invalid email: empty', () => {
            try {
                email = ''
                EmailValidator.validate(email)
                assert.fail()
            } catch (err) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.VALIDATE.INVALID_EMAIL.replace('{0}', ''))
            }
        })

        it('should throw ValidationException for invalid email', () => {
            try {
                email = 'invalid_email@mailcom'
                EmailValidator.validate(email)
                assert.fail()
            } catch (err) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.VALIDATE.INVALID_EMAIL
                    .replace('{0}', 'invalid_email@mailcom'))
            }
        })
    })
})
