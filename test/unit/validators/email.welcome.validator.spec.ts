import { assert } from 'chai'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { EmailWelcomeValidator } from '../../../src/application/domain/validator/email.welcome.validator'
import { ValidationException } from '../../../src/application/domain/exception/validation.exception'
import { Strings } from '../../../src/utils/strings'

describe('VALIDATORS: EmailWelcomeValidator', () => {
    let welcomeEmail: any = JSON.parse(JSON.stringify(DefaultEntityMock.WELCOME_EMAIL))

    afterEach(() => {
        welcomeEmail = JSON.parse(JSON.stringify(DefaultEntityMock.WELCOME_EMAIL))
    })

    context('when the welcome email is valid', () => {
        it('should return undefined when the validation was successful', () => {
            try {
                const result = EmailWelcomeValidator.validate(welcomeEmail)
                assert.isUndefined(result)
            } catch (err) {
                assert.fail(err)
            }
        })
    })

    context('when the welcome email is incomplete', () => {
        it('should throw ValidationException for an incomplete welcome email (missing to)', () => {
            try {
                welcomeEmail.to = undefined
                EmailWelcomeValidator.validate(welcomeEmail)
                assert.fail()
            } catch (err) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS)
                assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS_DESC
                    .replace('{0}', 'to'))
            }
        })

        it('should throw ValidationException for an incomplete welcome email (missing all fields)', () => {
            try {
                EmailWelcomeValidator.validate({})
                assert.fail()
            } catch (err) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS)
                assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS_DESC
                    .replace('{0}', 'to, action_url'))
            }
        })
    })

    context('when the \'to\' email from the welcome email is invalid', () => {
        it('should throw a ValidationException for invalid email', () => {
            try {
                welcomeEmail.to.email = 'invalid_email@mailcom'
                EmailWelcomeValidator.validate(welcomeEmail)
                assert.fail()
            } catch (err) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.VALIDATE.INVALID_EMAIL
                    .replace('{0}', 'invalid_email@mailcom'))
            }
        })
    })
})
