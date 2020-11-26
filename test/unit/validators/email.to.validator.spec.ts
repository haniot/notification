import { assert } from 'chai'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { EmailToValidator } from '../../../src/application/domain/validator/email.to.validator'
import { ValidationException } from '../../../src/application/domain/exception/validation.exception'
import { Strings } from '../../../src/utils/strings'

describe('VALIDATORS: EmailToValidator', () => {
    let emailTo: any = JSON.parse(JSON.stringify(DefaultEntityMock.ADDRESS))

    afterEach(() => {
        emailTo = JSON.parse(JSON.stringify(DefaultEntityMock.ADDRESS))
    })

    context('when the email \'to\' is valid', () => {
        it('should return undefined when the validation was successful', () => {
            try {
                const result = EmailToValidator.validate(emailTo)
                assert.isUndefined(result)
            } catch (err) {
                assert.fail(err)
            }
        })
    })

    context('when the email \'to\' is incomplete', () => {
        it('should throw ValidationException for an incomplete email \'to\' (missing name)', () => {
            try {
                emailTo.name = undefined
                EmailToValidator.validate(emailTo)
                assert.fail()
            } catch (err) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.VALIDATE.INVALID_TO)
                assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.VALIDATE.INVALID_TO_DESC.replace('{0}', 'name'))
            }
        })

        it('should throw ValidationException for an incomplete email \'to\' (missing email)', () => {
            try {
                emailTo.email = undefined
                EmailToValidator.validate(emailTo)
                assert.fail()
            } catch (err) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.VALIDATE.INVALID_TO)
                assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.VALIDATE.INVALID_TO_DESC.replace('{0}', 'email'))
            }
        })
    })

    context('when the \'to\' email is invalid', () => {
        it('should throw a ValidationException for invalid email', () => {
            try {
                emailTo.email = 'invalid_email@mailcom'
                EmailToValidator.validate(emailTo)
                assert.fail()
            } catch (err) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.VALIDATE.INVALID_EMAIL
                    .replace('{0}', 'invalid_email@mailcom'))
            }
        })
    })
})
