import { assert } from 'chai'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { EmailUpdatePasswordValidator } from '../../../src/application/domain/validator/email.update.password.validator'
import { ValidationException } from '../../../src/application/domain/exception/validation.exception'
import { Strings } from '../../../src/utils/strings'

describe('VALIDATORS: EmailUpdatePasswordValidator', () => {
    let updatePasswordEmail: any = JSON.parse(JSON.stringify(DefaultEntityMock.UPDATE_PASSWORD_EMAIL))

    afterEach(() => {
        updatePasswordEmail = JSON.parse(JSON.stringify(DefaultEntityMock.UPDATE_PASSWORD_EMAIL))
    })

    context('when the update password email is valid', () => {
        it('should return undefined when the validation was successful', () => {
            try {
                const result = EmailUpdatePasswordValidator.validate(updatePasswordEmail)
                assert.isUndefined(result)
            } catch (err) {
                assert.fail(err)
            }
        })
    })

    context('when the update password email is incomplete', () => {
        it('should throw ValidationException for an incomplete update password email (missing to)', () => {
            try {
                updatePasswordEmail.to = undefined
                EmailUpdatePasswordValidator.validate(updatePasswordEmail)
                assert.fail()
            } catch (err) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS)
                assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS_DESC
                    .replace('{0}', 'to'))
            }
        })
    })

    context('when the \'to\' email from the update password email is invalid', () => {
        it('should throw a ValidationException for invalid email', () => {
            try {
                updatePasswordEmail.to.email = 'invalid_email@mailcom'
                EmailUpdatePasswordValidator.validate(updatePasswordEmail)
                assert.fail()
            } catch (err) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.VALIDATE.INVALID_EMAIL
                    .replace('{0}', 'invalid_email@mailcom'))
            }
        })
    })
})
