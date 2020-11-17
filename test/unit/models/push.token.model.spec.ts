import { assert } from 'chai'
import { PushToken } from '../../../src/application/domain/model/push.token'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'

describe('MODELS: PushToken', () => {
    const pushTokenJSON: any = JSON.parse(JSON.stringify(DefaultEntityMock.PUSH_TOKEN))

    describe('fromJSON()', () => {
        context('when a json is passed', () => {
            it('should return a PushToken from a complete json', () => {
                const result: PushToken = new PushToken().fromJSON(pushTokenJSON)

                assert.propertyVal(result, 'id', pushTokenJSON.id)
                assert.propertyVal(result, 'user_id', pushTokenJSON.user_id)
                assert.propertyVal(result, 'client_type', pushTokenJSON.client_type)
                assert.propertyVal(result, 'token', pushTokenJSON.token)
            })

            it('should return a PushToken with some attributes equal to undefined from an empty json', () => {
                const result: PushToken = new PushToken().fromJSON({})

                assert.isUndefined(result.id)
            })
        })

        context('when the parameter is undefined', () => {
            it('should return a PushToken with some attributes equal to undefined from an undefined json', () => {
                const result: PushToken = new PushToken().fromJSON(undefined)

                assert.isUndefined(result.id)
            })
        })

        context('when the json is a string', () => {
            it('should return a PushToken from a complete json', () => {
                const result: PushToken = new PushToken().fromJSON(JSON.stringify(pushTokenJSON))

                assert.propertyVal(result, 'id', pushTokenJSON.id)
                assert.propertyVal(result, 'user_id', pushTokenJSON.user_id)
                assert.propertyVal(result, 'client_type', pushTokenJSON.client_type)
                assert.propertyVal(result, 'token', pushTokenJSON.token)
            })

            it('should return a PushToken with some attributes equal to undefined from an empty string', () => {
                const result: PushToken = new PushToken().fromJSON(JSON.stringify(''))

                assert.isUndefined(result.id)
            })

            it('should return a PushToken with some attributes equal to undefined from an invalid string', () => {
                const result: PushToken = new PushToken().fromJSON('d52215d412')

                assert.isUndefined(result.id)
            })
        })
    })

    describe('toJSON()', () => {
        context('when toJSON() is executed', () => {
            it('should return a JSON from a complete PushToken', () => {
                const pushToken: PushToken = new PushToken().fromJSON(pushTokenJSON)
                const result: any = pushToken.toJSON()

                assert.propertyVal(result, 'id', pushTokenJSON.id)
                assert.propertyVal(result, 'user_id', pushTokenJSON.user_id)
                assert.propertyVal(result, 'client_type', pushTokenJSON.client_type)
                assert.propertyVal(result, 'token', pushTokenJSON.token)
            })

            it('should return a JSON with all attributes equal to undefined from an incomplete PushToken', () => {
                const result: any = new PushToken().toJSON()

                assert.isUndefined(result.id)
                assert.isUndefined(result.user_id)
                assert.isUndefined(result.client_type)
                assert.isUndefined(result.token)
            })
        })
    })
})
