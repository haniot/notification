import { assert } from 'chai'
import { ValidationException } from '../../../src/application/domain/exception/validation.exception'
import { Strings } from '../../../src/utils/strings'
import { PushToken, PushTokenClientTypes } from '../../../src/application/domain/model/push.token'
import { PushTokenMock } from '../../mocks/models/push.token.mock'
import { PushTokenValidator } from '../../../src/application/domain/validator/push.token.validator'

describe('VALIDATORS: PushTokenValidator', () => {
    let pushToken: PushToken = new PushTokenMock().generate()

    afterEach(() => {
        pushToken = new PushTokenMock().generate()
    })

    context('when the PushToken is valid', () => {
        it('should return undefined when the validation was successful', () => {
            try {
                const result = PushTokenValidator.validate(pushToken)
                assert.isUndefined(result)
            } catch (err) {
                assert.fail(err)
            }
        })
    })

    context('when the PushToken is incomplete', () => {
        it('should throw ValidationException for an incomplete PushToken (missing user_id)', () => {
            try {
                pushToken.user_id = undefined
                PushTokenValidator.validate(pushToken)
                assert.fail()
            } catch (err) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS)
                assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS_DESC
                    .replace('{0}', 'user_id'))
            }
        })

        it('should throw ValidationException for an incomplete PushToken (missing all fields)', () => {
            try {
                PushTokenValidator.validate(new PushToken())
                assert.fail()
            } catch (err) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS)
                assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS_DESC
                    .replace('{0}', 'user_id, client_type, token'))
            }
        })
    })

    context('when the PushToken user_id is invalid', () => {
        it('should throw ValidationException for invalid ObjectId: 123', () => {
            try {
                pushToken.user_id = '123'
                PushTokenValidator.validate(pushToken)
                assert.fail()
            } catch (err) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.USER.PARAM_ID_NOT_VALID_FORMAT)
                assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.VALIDATE.UUID_NOT_VALID_FORMAT_DESC)
            }
        })
    })

    context('when the PushToken client_type is invalid', () => {
        const pushTokenClientTypes: Array<string> = Object.values(PushTokenClientTypes)

        it('should throw a ValidationException for an unmapped type', () => {
            try {
                pushToken.client_type = 'invalidClientType'
                PushTokenValidator.validate(pushToken)
                assert.fail()
            } catch (err) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message',
                    `${Strings.ERROR_MESSAGE.VALIDATE.NOT_MAPPED.replace('{0}', 'client_type')} invalidClientType`)
                assert.propertyVal(err, 'description', `${Strings.ERROR_MESSAGE.VALIDATE.NOT_MAPPED_DESC} ${pushTokenClientTypes.join(', ')}.`)
            }
        })
    })
})
