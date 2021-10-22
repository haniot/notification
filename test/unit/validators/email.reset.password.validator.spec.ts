import { assert } from 'chai'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { EmailResetPasswordValidator } from '../../../src/application/domain/validator/email.reset.password.validator'
import { ValidationException } from '../../../src/application/domain/exception/validation.exception'
import { Strings } from '../../../src/utils/strings'

describe('VALIDATORS: EmailResetPasswordValidator', () => {
    let resetPasswordEmail: any = JSON.parse(JSON.stringify(DefaultEntityMock.RESET_PASSWORD_EMAIL))

    afterEach(() => {
        resetPasswordEmail = JSON.parse(JSON.stringify(DefaultEntityMock.RESET_PASSWORD_EMAIL))
    })

    context('when the reset password email is valid', () => {
        it('should return undefined when the validation was successful', () => {
            try {
                const result = EmailResetPasswordValidator.validate(resetPasswordEmail)
                assert.isUndefined(result)
            } catch (err: any) {
                assert.fail(err)
            }
        })
    })

    context('when the reset password email is incomplete', () => {
        it('should throw ValidationException for an incomplete reset password email (missing to)', () => {
            try {
                resetPasswordEmail.to = undefined
                EmailResetPasswordValidator.validate(resetPasswordEmail)
                assert.fail()
            } catch (err: any) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS)
                assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS_DESC
                    .replace('{0}', 'to'))
            }
        })

        it('should throw ValidationException for an incomplete reset password email (missing all fields)', () => {
            try {
                EmailResetPasswordValidator.validate({})
                assert.fail()
            } catch (err: any) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS)
                assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS_DESC
                    .replace('{0}', 'to, action_url'))
            }
        })
    })

    context('when the \'to\' email from the reset password email is invalid', () => {
        it('should throw a ValidationException for invalid email', () => {
            try {
                resetPasswordEmail.to.email = 'invalid_email@mailcom'
                EmailResetPasswordValidator.validate(resetPasswordEmail)
                assert.fail()
            } catch (err: any) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.VALIDATE.INVALID_EMAIL
                    .replace('{0}', 'invalid_email@mailcom'))
            }
        })
    })
})
