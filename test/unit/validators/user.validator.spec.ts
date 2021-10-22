import { assert } from 'chai'
import { ValidationException } from '../../../src/application/domain/exception/validation.exception'
import { Strings } from '../../../src/utils/strings'
import { User } from '../../../src/application/domain/model/user'
import { UserValidator } from '../../../src/application/domain/validator/user.validator'
import { UserMock } from '../../mocks/models/user.mock'

describe('VALIDATORS: UserValidator', () => {
    let user: User = new UserMock().generate()

    afterEach(() => {
        user = new UserMock().generate()
    })

    context('when the User is valid', () => {
        it('should return undefined when the validation was successful', () => {
            try {
                const result = UserValidator.validate(user)
                assert.isUndefined(result)
            } catch (err: any) {
                assert.fail(err)
            }
        })
    })

    context('when the User is incomplete', () => {
        it('should throw ValidationException for an incomplete User (missing id)', () => {
            try {
                user.id = undefined
                UserValidator.validate(user)
                assert.fail()
            } catch (err: any) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS)
                assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS_DESC
                    .replace('{0}', 'id'))
            }
        })


        it('should throw ValidationException for an incomplete User (missing all fields)', () => {
            try {
                UserValidator.validate(new User())
                assert.fail()
            } catch (err: any) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS)
                assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS_DESC
                    .replace('{0}', 'id, type'))
            }
        })
    })

    context('when the User id is invalid', () => {
        it('should throw ValidationException for invalid ObjectId: 123', () => {
            try {
                user.id = '123'
                UserValidator.validate(user)
                assert.fail()
            } catch (err: any) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.VALIDATE.UUID_NOT_VALID_FORMAT)
                assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.VALIDATE.UUID_NOT_VALID_FORMAT_DESC)
            }
        })
    })
})
