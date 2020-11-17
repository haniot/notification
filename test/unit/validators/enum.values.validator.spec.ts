import { assert } from 'chai'
import { ValidationException } from '../../../src/application/domain/exception/validation.exception'
import { Strings } from '../../../src/utils/strings'
import { EnumValuesValidator } from '../../../src/application/domain/validator/enum.values.validator'
import { PushTokenClientTypes } from '../../../src/application/domain/model/push.token'
import { PushTypes } from '../../../src/application/domain/model/push'
import { ChoiceTypes } from '../../../src/application/domain/utils/choice.types'
import { EmailTemplateResources, EmailTemplateTypes } from '../../../src/application/domain/model/email.template'

describe('VALIDATORS: EnumValuesValidator', () => {
    context('when the enum value is valid', () => {
        it('should return undefined when the validation was successful for push token client type', () => {
            try {
                const result = EnumValuesValidator.validate(PushTokenClientTypes.WEB, 'client_type', PushTokenClientTypes)
                assert.isUndefined(result)
            } catch (err) {
                assert.fail(err)
            }
        })

        it('should return undefined when the validation was successful for push type', () => {
            try {
                const result = EnumValuesValidator.validate(PushTypes.DIRECT, 'type', PushTypes)
                assert.isUndefined(result)
            } catch (err) {
                assert.fail(err)
            }
        })

        it('should return undefined when the validation was successful for choice type', () => {
            try {
                const result = EnumValuesValidator.validate(ChoiceTypes.YES, 'keep_it', ChoiceTypes)
                assert.isUndefined(result)
            } catch (err) {
                assert.fail(err)
            }
        })

        it('should return undefined when the validation was successful for template type', () => {
            try {
                const result = EnumValuesValidator.validate(EmailTemplateTypes.WELCOME, 'type', EmailTemplateTypes)
                assert.isUndefined(result)
            } catch (err) {
                assert.fail(err)
            }
        })

        it('should return undefined when the validation was successful for template resource type', () => {
            try {
                const result = EnumValuesValidator.validate(EmailTemplateResources.HTML, 'resource', EmailTemplateResources)
                assert.isUndefined(result)
            } catch (err) {
                assert.fail(err)
            }
        })
    })

    context('when the push token client type is invalid', () => {
        const pushTokenClientTypes: Array<string> = Object.values(PushTokenClientTypes)

        it('should throw a ValidationException for an unmapped type', () => {
            try {
                EnumValuesValidator.validate('invalidClientType', 'client_type', PushTokenClientTypes)
                assert.fail()
            } catch (err) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message',
                    `${Strings.ERROR_MESSAGE.VALIDATE.NOT_MAPPED.replace('{0}', 'client_type')} invalidClientType`)
                assert.propertyVal(err, 'description',
                    `${Strings.ERROR_MESSAGE.VALIDATE.NOT_MAPPED_DESC} ${pushTokenClientTypes.join(', ')}.`)
            }
        })

        it('should throw a ValidationException for an undefined type', () => {
            try {
                EnumValuesValidator.validate(undefined!, 'client_type', PushTokenClientTypes)
                assert.fail()
            } catch (err) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message',
                    `${Strings.ERROR_MESSAGE.VALIDATE.NOT_MAPPED.replace('{0}', 'client_type')} undefined`)
                assert.propertyVal(err, 'description',
                    `${Strings.ERROR_MESSAGE.VALIDATE.NOT_MAPPED_DESC} ${pushTokenClientTypes.join(', ')}.`)
            }
        })

        it('should throw a ValidationException for a null type', () => {
            try {
                EnumValuesValidator.validate(null!, 'client_type', PushTokenClientTypes)
                assert.fail()
            } catch (err) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message',
                    `${Strings.ERROR_MESSAGE.VALIDATE.NOT_MAPPED.replace('{0}', 'client_type')} null`)
                assert.propertyVal(err, 'description',
                    `${Strings.ERROR_MESSAGE.VALIDATE.NOT_MAPPED_DESC} ${pushTokenClientTypes.join(', ')}.`)
            }
        })

        it('should throw a ValidationException for an empty type', () => {
            try {
                EnumValuesValidator.validate('', 'client_type', PushTokenClientTypes)
                assert.fail()
            } catch (err) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message',
                    `${Strings.ERROR_MESSAGE.VALIDATE.NOT_MAPPED.replace('{0}', 'client_type')} `)
                assert.propertyVal(err, 'description',
                    `${Strings.ERROR_MESSAGE.VALIDATE.NOT_MAPPED_DESC} ${pushTokenClientTypes.join(', ')}.`)
            }
        })
    })

    context('when the push type is invalid', () => {
        const pushTypes: Array<string> = Object.values(PushTypes)

        it('should throw a ValidationException for an unmapped type', () => {
            try {
                EnumValuesValidator.validate('invalidPushType', 'type', PushTypes)
                assert.fail()
            } catch (err) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message',
                    `${Strings.ERROR_MESSAGE.VALIDATE.NOT_MAPPED.replace('{0}', 'type')} invalidPushType`)
                assert.propertyVal(err, 'description',
                    `${Strings.ERROR_MESSAGE.VALIDATE.NOT_MAPPED_DESC} ${pushTypes.join(', ')}.`)
            }
        })

        it('should throw a ValidationException for an undefined type', () => {
            try {
                EnumValuesValidator.validate(undefined!, 'type', PushTypes)
                assert.fail()
            } catch (err) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message',
                    `${Strings.ERROR_MESSAGE.VALIDATE.NOT_MAPPED.replace('{0}', 'type')} undefined`)
                assert.propertyVal(err, 'description',
                    `${Strings.ERROR_MESSAGE.VALIDATE.NOT_MAPPED_DESC} ${pushTypes.join(', ')}.`)
            }
        })

        it('should throw a ValidationException for a null type', () => {
            try {
                EnumValuesValidator.validate(null!, 'type', PushTypes)
                assert.fail()
            } catch (err) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message',
                    `${Strings.ERROR_MESSAGE.VALIDATE.NOT_MAPPED.replace('{0}', 'type')} null`)
                assert.propertyVal(err, 'description',
                    `${Strings.ERROR_MESSAGE.VALIDATE.NOT_MAPPED_DESC} ${pushTypes.join(', ')}.`)
            }
        })

        it('should throw a ValidationException for an empty type', () => {
            try {
                EnumValuesValidator.validate('', 'type', PushTypes)
                assert.fail()
            } catch (err) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message',
                    `${Strings.ERROR_MESSAGE.VALIDATE.NOT_MAPPED.replace('{0}', 'type')} `)
                assert.propertyVal(err, 'description',
                    `${Strings.ERROR_MESSAGE.VALIDATE.NOT_MAPPED_DESC} ${pushTypes.join(', ')}.`)
            }
        })
    })

    context('when the choice type is invalid', () => {
        const choiceTypes: Array<string> = Object.values(ChoiceTypes)

        it('should throw a ValidationException for an unmapped type', () => {
            try {
                EnumValuesValidator.validate('invalidChoiceType', 'keep_it', ChoiceTypes)
                assert.fail()
            } catch (err) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message',
                    `${Strings.ERROR_MESSAGE.VALIDATE.NOT_MAPPED.replace('{0}', 'keep_it')} invalidChoiceType`)
                assert.propertyVal(err, 'description',
                    `${Strings.ERROR_MESSAGE.VALIDATE.NOT_MAPPED_DESC} ${choiceTypes.join(', ')}.`)
            }
        })

        it('should throw a ValidationException for an undefined type', () => {
            try {
                EnumValuesValidator.validate(undefined!, 'keep_it', ChoiceTypes)
                assert.fail()
            } catch (err) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message',
                    `${Strings.ERROR_MESSAGE.VALIDATE.NOT_MAPPED.replace('{0}', 'keep_it')} undefined`)
                assert.propertyVal(err, 'description',
                    `${Strings.ERROR_MESSAGE.VALIDATE.NOT_MAPPED_DESC} ${choiceTypes.join(', ')}.`)
            }
        })

        it('should throw a ValidationException for a null type', () => {
            try {
                EnumValuesValidator.validate(null!, 'keep_it', ChoiceTypes)
                assert.fail()
            } catch (err) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message',
                    `${Strings.ERROR_MESSAGE.VALIDATE.NOT_MAPPED.replace('{0}', 'keep_it')} null`)
                assert.propertyVal(err, 'description',
                    `${Strings.ERROR_MESSAGE.VALIDATE.NOT_MAPPED_DESC} ${choiceTypes.join(', ')}.`)
            }
        })

        it('should throw a ValidationException for an empty type', () => {
            try {
                EnumValuesValidator.validate('', 'keep_it', ChoiceTypes)
                assert.fail()
            } catch (err) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message',
                    `${Strings.ERROR_MESSAGE.VALIDATE.NOT_MAPPED.replace('{0}', 'keep_it')} `)
                assert.propertyVal(err, 'description',
                    `${Strings.ERROR_MESSAGE.VALIDATE.NOT_MAPPED_DESC} ${choiceTypes.join(', ')}.`)
            }
        })
    })

    context('when the email template type is invalid', () => {
        const emailTemplateTypes: Array<string> = Object.values(EmailTemplateTypes)

        it('should throw a ValidationException for an unmapped type', () => {
            try {
                EnumValuesValidator.validate('invalidEmailTemplateType', 'type', EmailTemplateTypes)
                assert.fail()
            } catch (err) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message',
                    `${Strings.ERROR_MESSAGE.VALIDATE.NOT_MAPPED.replace('{0}', 'type')} invalidEmailTemplateType`)
                assert.propertyVal(err, 'description',
                    `${Strings.ERROR_MESSAGE.VALIDATE.NOT_MAPPED_DESC} ${emailTemplateTypes.join(', ')}.`)
            }
        })

        it('should throw a ValidationException for an undefined type', () => {
            try {
                EnumValuesValidator.validate(undefined!, 'type', EmailTemplateTypes)
                assert.fail()
            } catch (err) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message',
                    `${Strings.ERROR_MESSAGE.VALIDATE.NOT_MAPPED.replace('{0}', 'type')} undefined`)
                assert.propertyVal(err, 'description',
                    `${Strings.ERROR_MESSAGE.VALIDATE.NOT_MAPPED_DESC} ${emailTemplateTypes.join(', ')}.`)
            }
        })

        it('should throw a ValidationException for a null type', () => {
            try {
                EnumValuesValidator.validate(null!, 'type', EmailTemplateTypes)
                assert.fail()
            } catch (err) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message',
                    `${Strings.ERROR_MESSAGE.VALIDATE.NOT_MAPPED.replace('{0}', 'type')} null`)
                assert.propertyVal(err, 'description',
                    `${Strings.ERROR_MESSAGE.VALIDATE.NOT_MAPPED_DESC} ${emailTemplateTypes.join(', ')}.`)
            }
        })

        it('should throw a ValidationException for an empty type', () => {
            try {
                EnumValuesValidator.validate('', 'type', EmailTemplateTypes)
                assert.fail()
            } catch (err) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message',
                    `${Strings.ERROR_MESSAGE.VALIDATE.NOT_MAPPED.replace('{0}', 'type')} `)
                assert.propertyVal(err, 'description',
                    `${Strings.ERROR_MESSAGE.VALIDATE.NOT_MAPPED_DESC} ${emailTemplateTypes.join(', ')}.`)
            }
        })
    })

    context('when the email template resource type is invalid', () => {
        const emailTemplateResourceTypes: Array<string> = Object.values(EmailTemplateResources)

        it('should throw a ValidationException for an unmapped type', () => {
            try {
                EnumValuesValidator.validate('invalidResource', 'resource', EmailTemplateResources)
                assert.fail()
            } catch (err) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message',
                    `${Strings.ERROR_MESSAGE.VALIDATE.NOT_MAPPED.replace('{0}', 'resource')} invalidResource`)
                assert.propertyVal(err, 'description',
                    `${Strings.ERROR_MESSAGE.VALIDATE.NOT_MAPPED_DESC} ${emailTemplateResourceTypes.join(', ')}.`)
            }
        })

        it('should throw a ValidationException for an undefined type', () => {
            try {
                EnumValuesValidator.validate(undefined!, 'resource', EmailTemplateResources)
                assert.fail()
            } catch (err) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message',
                    `${Strings.ERROR_MESSAGE.VALIDATE.NOT_MAPPED.replace('{0}', 'resource')} undefined`)
                assert.propertyVal(err, 'description',
                    `${Strings.ERROR_MESSAGE.VALIDATE.NOT_MAPPED_DESC} ${emailTemplateResourceTypes.join(', ')}.`)
            }
        })

        it('should throw a ValidationException for a null type', () => {
            try {
                EnumValuesValidator.validate(null!, 'resource', EmailTemplateResources)
                assert.fail()
            } catch (err) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message',
                    `${Strings.ERROR_MESSAGE.VALIDATE.NOT_MAPPED.replace('{0}', 'resource')} null`)
                assert.propertyVal(err, 'description',
                    `${Strings.ERROR_MESSAGE.VALIDATE.NOT_MAPPED_DESC} ${emailTemplateResourceTypes.join(', ')}.`)
            }
        })

        it('should throw a ValidationException for an empty type', () => {
            try {
                EnumValuesValidator.validate('', 'resource', EmailTemplateResources)
                assert.fail()
            } catch (err) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message',
                    `${Strings.ERROR_MESSAGE.VALIDATE.NOT_MAPPED.replace('{0}', 'resource')} `)
                assert.propertyVal(err, 'description',
                    `${Strings.ERROR_MESSAGE.VALIDATE.NOT_MAPPED_DESC} ${emailTemplateResourceTypes.join(', ')}.`)
            }
        })
    })
})
