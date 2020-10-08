import { assert } from 'chai'
import { Strings } from '../../../src/utils/strings'
import { StringValidator } from '../../../src/application/domain/validator/string.validator'
import { ValidationException } from '../../../src/application/domain/exception/validation.exception'

describe('VALIDATORS: StringValidator', () => {
    context('when the string is valid', () => {
        it('should return undefined when the validation was successful', () => {
            try {
                const result = StringValidator.validate('valid_string', 'test_field')
                assert.isUndefined(result)
            } catch (err) {
                assert.fail(err)
            }
        })
    })

    context('when the string is invalid', () => {
        it('should throw ValidationException for invalid string: undefined', () => {
            try {
                StringValidator.validate(undefined!, 'test_field')
                assert.fail()
            } catch (err) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.VALIDATE.INVALID_FIELDS)
                assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.VALIDATE.INVALID_STRING.replace('{0}', 'test_field'))
            }
        })

        it('should throw ValidationException for invalid string: null', () => {
            try {
                StringValidator.validate(null!, 'test_field')
                assert.fail()
            } catch (err) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.VALIDATE.INVALID_FIELDS)
                assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.VALIDATE.INVALID_STRING.replace('{0}', 'test_field'))
            }
        })

        it('should throw ValidationException for empty string', () => {
            try {
                StringValidator.validate('', 'test_field')
                assert.fail()
            } catch (err) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.VALIDATE.INVALID_FIELDS)
                assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.VALIDATE.EMPTY_STRING.replace('{0}', 'test_field'))
            }
        })
    })
})
