import { assert } from 'chai'
import { Push } from '../../../src/application/domain/model/push'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'

describe('MODELS: Push', () => {
    const pushJSON: any = JSON.parse(JSON.stringify(DefaultEntityMock.PUSH))

    describe('fromJSON()', () => {
        context('when a json is passed', () => {
            it('should return a Push from a complete json', () => {
                const result: Push = new Push().fromJSON(pushJSON)

                assert.propertyVal(result, 'id', pushJSON.id)
                assert.propertyVal(result, 'type', pushJSON.type)
                assert.propertyVal(result, 'keep_it', pushJSON.keep_it)
                assert.propertyVal(result, 'is_read', pushJSON.is_read)
                assert.propertyVal(result, 'to', pushJSON.to)
                assert.propertyVal(result.message, 'type', pushJSON.message.type)
                assert.propertyVal(result.message, 'pt', pushJSON.message.pt)
                assert.propertyVal(result.message, 'en', pushJSON.message.en)
                assert.propertyVal(result, 'user_id', pushJSON.user_id)
            })

            it('should return a Push with some attributes equal to undefined from an empty json', () => {
                const result: Push = new Push().fromJSON({})

                assert.isUndefined(result.id)
            })
        })

        context('when the parameter is undefined', () => {
            it('should return a Push with some attributes equal to undefined from an undefined json', () => {
                const result: Push = new Push().fromJSON(undefined)

                assert.isUndefined(result.id)
            })
        })

        context('when the json is a string', () => {
            it('should return a Push from a complete json', () => {
                const result: Push = new Push().fromJSON(JSON.stringify(pushJSON))

                assert.propertyVal(result, 'id', pushJSON.id)
                assert.propertyVal(result, 'type', pushJSON.type)
                assert.propertyVal(result, 'keep_it', pushJSON.keep_it)
                assert.propertyVal(result, 'is_read', pushJSON.is_read)
                assert.deepPropertyVal(result, 'to', pushJSON.to)
                assert.propertyVal(result.message, 'type', pushJSON.message.type)
                assert.deepPropertyVal(result.message, 'pt', pushJSON.message.pt)
                assert.deepPropertyVal(result.message, 'en', pushJSON.message.en)
                assert.propertyVal(result, 'user_id', pushJSON.user_id)
            })

            it('should return a Push with some attributes equal to undefined from an empty string', () => {
                const result: Push = new Push().fromJSON(JSON.stringify(''))

                assert.isUndefined(result.id)
            })

            it('should return a Push with some attributes equal to undefined from an invalid string', () => {
                const result: Push = new Push().fromJSON('d52215d412')

                assert.isUndefined(result.id)
            })
        })
    })

    describe('toJSON()', () => {
        context('when toJSON() is executed', () => {
            it('should return a JSON from a complete Push', () => {
                const push: Push = new Push().fromJSON(pushJSON)
                push.createdAt = pushJSON.created_at
                const result: any = push.toJSON()

                assert.propertyVal(result, 'id', pushJSON.id)
                assert.propertyVal(result, 'type', pushJSON.type)
                assert.propertyVal(result, 'keep_it', pushJSON.keep_it)
                assert.propertyVal(result, 'is_read', pushJSON.is_read)
                assert.propertyVal(result, 'to', pushJSON.to)
                assert.deepPropertyVal(result, 'message', pushJSON.message)
                assert.propertyVal(result, 'created_at', pushJSON.created_at)
                assert.propertyVal(result, 'user_id', pushJSON.user_id)
            })

            it('should return a JSON with all attributes equal to undefined from an incomplete Push', () => {
                const result: any = new Push().toJSON()

                assert.isUndefined(result.id)
                assert.isUndefined(result.type)
                assert.isUndefined(result.keep_it)
                assert.isUndefined(result.is_read)
                assert.isUndefined(result.to)
                assert.isUndefined(result.message)
                assert.isUndefined(result.created_at)
                assert.isUndefined(result.user_id)
            })
        })
    })
})
