import { assert } from 'chai'
import { Address } from '../../../src/application/domain/model/address'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'

describe('MODELS: Address', () => {
    const addressJSON: any = JSON.parse(JSON.stringify(DefaultEntityMock.ADDRESS))

    describe('fromJSON()', () => {
        context('when a json is passed', () => {
            it('should return an Address from a complete json', () => {
                const result: Address = new Address().fromJSON(addressJSON)

                assert.propertyVal(result, 'name', addressJSON.name)
                assert.propertyVal(result, 'email', addressJSON.email)
            })

            it('should return an Address with some attributes equal to undefined from an empty json', () => {
                const result: Address = new Address().fromJSON({})

                assert.isEmpty(result)
            })
        })

        context('when the parameter is undefined', () => {
            it('should return an Address with some attributes equal to undefined from an undefined json', () => {
                const result: Address = new Address().fromJSON(undefined)

                assert.isEmpty(result)
            })
        })

        context('when the json is a string', () => {
            it('should return an Address from a complete json', () => {
                const result: Address = new Address().fromJSON(JSON.stringify(addressJSON))

                assert.propertyVal(result, 'name', addressJSON.name)
                assert.propertyVal(result, 'email', addressJSON.email)
            })

            it('should return an Address with some attributes equal to undefined from an empty string', () => {
                const result: Address = new Address().fromJSON(JSON.stringify(''))

                assert.isEmpty(result)
            })

            it('should return an Address with some attributes equal to undefined from an invalid string', () => {
                const result: Address = new Address().fromJSON('d52215d412')

                assert.isEmpty(result)
            })
        })
    })

    describe('toJSON()', () => {
        context('when toJSON() is executed', () => {
            it('should return a JSON from a complete Address', () => {
                const address: Address = new Address(addressJSON.name, addressJSON.email)
                const result: any = address.toJSON()

                assert.propertyVal(result, 'name', addressJSON.name)
                assert.propertyVal(result, 'email', addressJSON.email)
            })

            it('should return a JSON with all attributes equal to undefined from an incomplete Address', () => {
                const result: any = new Address().toJSON()

                assert.isUndefined(result.id)
                assert.isUndefined(result.type)
            })
        })
    })
})
