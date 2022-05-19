import { assert } from 'chai'
import { ValidationException } from '../../../src/application/domain/exception/validation.exception'
import { Strings } from '../../../src/utils/strings'
import { Push, PushTypes } from '../../../src/application/domain/model/push'
import { PushMock } from '../../mocks/models/push.mock'
import { PushValidator } from '../../../src/application/domain/validator/push.validator'
import { ChoiceTypes } from '../../../src/application/domain/utils/choice.types'

describe('VALIDATORS: PushValidator', () => {
    let push: Push = new PushMock().generate(PushTypes.TOPIC)

    afterEach(() => {
        push = new PushMock().generate(PushTypes.DIRECT)
    })

    context('when the Push is valid', () => {
        it('should return undefined when the validation was successful', () => {
            try {
                const result = PushValidator.validate(push)
                assert.isUndefined(result)
            } catch (err: any) {
                assert.fail(err)
            }
        })
    })

    context('when the Push is incomplete', () => {
        it('should throw ValidationException for an incomplete Push (missing message.type)', () => {
            try {
                push.message!.type = undefined
                PushValidator.validate(push)
                assert.fail()
            } catch (err: any) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS)
                assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS_DESC
                    .replace('{0}', 'message.type'))
            }
        })

        it('should throw ValidationException for an incomplete Push (missing message.pt)', () => {
            try {
                push.message!.pt = undefined
                PushValidator.validate(push)
                assert.fail()
            } catch (err: any) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS)
                assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS_DESC
                    .replace('{0}', 'message.pt'))
            }
        })

        it('should throw ValidationException for an incomplete Push (missing message.pt.title)', () => {
            try {
                push.message!.pt.title = undefined
                PushValidator.validate(push)
                assert.fail()
            } catch (err: any) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS)
                assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS_DESC
                    .replace('{0}', 'message.pt.title'))
            }
        })

        it('should throw ValidationException for an incomplete Push (missing message.pt.text)', () => {
            try {
                push.message!.pt.text = undefined
                PushValidator.validate(push)
                assert.fail()
            } catch (err: any) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS)
                assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS_DESC
                    .replace('{0}', 'message.pt.text'))
            }
        })

        it('should throw ValidationException for an incomplete Push (missing message.en)', () => {
            try {
                push.message!.en = undefined
                PushValidator.validate(push)
                assert.fail()
            } catch (err: any) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS)
                assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS_DESC
                    .replace('{0}', 'message.en'))
            }
        })

        it('should throw ValidationException for an incomplete Push (missing message.en.title)', () => {
            try {
                push.message!.en.title = undefined
                PushValidator.validate(push)
                assert.fail()
            } catch (err: any) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS)
                assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS_DESC
                    .replace('{0}', 'message.en.title'))
            }
        })

        it('should throw ValidationException for an incomplete Push (missing message.en.text)', () => {
            try {
                push.message!.en.text = undefined
                PushValidator.validate(push)
                assert.fail()
            } catch (err: any) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS)
                assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS_DESC
                    .replace('{0}', 'message.en.text'))
            }
        })

        it('should throw ValidationException for an incomplete Push (missing all fields)', () => {
            try {
                PushValidator.validate(new Push())
                assert.fail()
            } catch (err: any) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS)
                assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS_DESC
                    .replace('{0}', 'type, keep_it, to, message, user_id'))
            }
        })
    })

    context('when the Push type is invalid', () => {
        const pushTypes: Array<string> = Object.values(PushTypes)

        it('should throw a ValidationException for an unmapped type', () => {
            try {
                push.type = 'invalidPushType'
                PushValidator.validate(push)
                assert.fail()
            } catch (err: any) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message',
                    `${Strings.ERROR_MESSAGE.VALIDATE.NOT_MAPPED.replace('{0}', 'type')} invalidPushType`)
                assert.propertyVal(err, 'description', `${Strings.ERROR_MESSAGE.VALIDATE.NOT_MAPPED_DESC} ${pushTypes.join(', ')}.`)
            }
        })
    })

    context('when the Push keep_it is invalid', () => {
        const choiceTypes: Array<string> = Object.values(ChoiceTypes)

        it('should throw a ValidationException for an unmapped keep_it', () => {
            try {
                push.keep_it = 'invalidChoiceType'
                PushValidator.validate(push)
                assert.fail()
            } catch (err: any) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message',
                    `${Strings.ERROR_MESSAGE.VALIDATE.NOT_MAPPED.replace('{0}', 'keep_it')} invalidChoiceType`)
                assert.propertyVal(err, 'description', `${Strings.ERROR_MESSAGE.VALIDATE.NOT_MAPPED_DESC} ${choiceTypes.join(', ')}.`)
            }
        })
    })

    context('when the Push to is invalid', () => {
        before(() => {
            push = new PushMock().generate(PushTypes.DIRECT)
        })

        it('should throw a ValidationException for an empty to', () => {
            try {
                push.to = []
                PushValidator.validate(push)
                assert.fail()
            } catch (err: any) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.VALIDATE.AT_LEAST_ONE_RECIPIENT)
                assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.VALIDATE.AT_LEAST_ONE_RECIPIENT_DESC)
            }
        })

        it('should throw a ValidationException for an invalid id in \'to\' array', () => {
            try {
                push.to = ['5f5a3c5accefbde6e36d1b31', '123', '4e3b3c5accefbde6e45d2c23']
                PushValidator.validate(push)
                assert.fail()
            } catch (err: any) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.VALIDATE.UUID_NOT_VALID_FORMAT)
                assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.VALIDATE.UUID_NOT_VALID_FORMAT_DESC)
            }
        })
    })

    context('when the Push user_id is invalid', () => {
        it('should throw ValidationException for invalid ObjectId: 123', () => {
            try {
                push.user_id = '123'
                PushValidator.validate(push)
                assert.fail()
            } catch (err: any) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.USER.PARAM_ID_NOT_VALID_FORMAT)
                assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.VALIDATE.UUID_NOT_VALID_FORMAT_DESC)
            }
        })
    })
})
