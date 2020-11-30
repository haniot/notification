import { assert } from 'chai'
import { User } from '../../../src/application/domain/model/user'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'

describe('MODELS: User', () => {
    const userJSON: any = JSON.parse(JSON.stringify(DefaultEntityMock.USER))

    describe('fromJSON()', () => {
        context('when a json is passed', () => {
            it('should return an User from a complete json', () => {
                const result: User = new User().fromJSON(userJSON)

                assert.propertyVal(result, 'id', userJSON.id)
                assert.propertyVal(result, 'type', userJSON.type)
            })

            it('should return an User with some attributes equal to undefined from an empty json', () => {
                const result: User = new User().fromJSON({})

                assert.isUndefined(result.id)
            })
        })

        context('when the parameter is undefined', () => {
            it('should return an User with some attributes equal to undefined from an undefined json', () => {
                const result: User = new User().fromJSON(undefined)

                assert.isUndefined(result.id)
            })
        })

        context('when the json is a string', () => {
            it('should return an User from a complete json', () => {
                const result: User = new User().fromJSON(JSON.stringify(userJSON))

                assert.propertyVal(result, 'id', userJSON.id)
                assert.propertyVal(result, 'type', userJSON.type)
            })

            it('should return an User with some attributes equal to undefined from an empty string', () => {
                const result: User = new User().fromJSON(JSON.stringify(''))

                assert.isUndefined(result.id)
            })

            it('should return an User with some attributes equal to undefined from an invalid string', () => {
                const result: User = new User().fromJSON('d52215d412')

                assert.isUndefined(result.id)
            })
        })
    })

    describe('toJSON()', () => {
        context('when toJSON() is executed', () => {
            it('should return a JSON from a complete User', () => {
                const user: User = new User().fromJSON(userJSON)
                const result: any = user.toJSON()

                assert.propertyVal(result, 'id', userJSON.id)
                assert.propertyVal(result, 'type', userJSON.type)
            })

            it('should return a JSON with all attributes equal to undefined from an incomplete User', () => {
                const result: any = new User().toJSON()

                assert.isUndefined(result.id)
                assert.isUndefined(result.type)
            })
        })
    })
})
