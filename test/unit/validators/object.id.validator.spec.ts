import { assert } from 'chai'
import { ObjectIdValidator } from '../../../src/application/domain/validator/object.id.validator'
import { ObjectID } from 'bson'
import { Strings } from '../../../src/utils/strings'
import { ValidationException } from '../../../src/application/domain/exception/validation.exception'

describe('VALIDATORS: ObjectIdValidator', () => {
    context('when the ObjectId is valid', () => {
        it('should return undefined when the validation was successful', () => {
            try {
                const result = ObjectIdValidator.validate(`${new ObjectID()}`)
                assert.isUndefined(result)
            } catch (err: any) {
                assert.fail(err)
            }
        })
    })

    context('when the ObjectId is invalid', () => {
        it('should throw ValidationException for invalid ObjectId: 123', () => {
            try {
                ObjectIdValidator.validate('123')
                assert.fail()
            } catch (err: any) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.VALIDATE.UUID_NOT_VALID_FORMAT)
                assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.VALIDATE.UUID_NOT_VALID_FORMAT_DESC)
            }
        })

        it('should throw an error for invalid ObjectId 123 received along with an error message', () => {
            try {
                ObjectIdValidator.validate('123', 'any message')
                assert.fail()
            } catch (err: any) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', 'any message')
                assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.VALIDATE.UUID_NOT_VALID_FORMAT_DESC)
            }
        })
    })
})
