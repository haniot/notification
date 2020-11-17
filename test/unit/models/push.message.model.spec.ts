import { assert } from 'chai'
import { PushMessage } from '../../../src/application/domain/model/push.message'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'

describe('MODELS: PushMessage', () => {
    const pushMessageJSON: any = JSON.parse(JSON.stringify(DefaultEntityMock.PUSH_MESSAGE))

    describe('fromJSON()', () => {
        context('when a json is passed', () => {
            it('should return a PushMessage from a complete json', () => {
                const result: PushMessage = new PushMessage().fromJSON(pushMessageJSON)

                assert.propertyVal(result, 'type', pushMessageJSON.type)
                assert.propertyVal(result, 'pt', pushMessageJSON.pt)
                assert.propertyVal(result, 'eng', pushMessageJSON.eng)
            })

            it('should return an empty PushMessage from an empty json', () => {
                const result: PushMessage = new PushMessage().fromJSON({})

                assert.isEmpty(result)
            })
        })

        context('when the parameter is undefined', () => {
            it('should return an empty PushMessage from an undefined json', () => {
                const result: PushMessage = new PushMessage().fromJSON(undefined)

                assert.isEmpty(result)
            })
        })

        context('when the json is a string', () => {
            it('should return a PushMessage from a complete json', () => {
                const result: PushMessage = new PushMessage().fromJSON(JSON.stringify(pushMessageJSON))

                assert.propertyVal(result, 'type', pushMessageJSON.type)
                assert.deepPropertyVal(result, 'pt', pushMessageJSON.pt)
                assert.deepPropertyVal(result, 'eng', pushMessageJSON.eng)
            })

            it('should return an empty PushMessage from an empty string', () => {
                const result: PushMessage = new PushMessage().fromJSON(JSON.stringify(''))

                assert.isEmpty(result)
            })

            it('should return an empty PushMessage from an invalid string', () => {
                const result: PushMessage = new PushMessage().fromJSON('d52215d412')

                assert.isEmpty(result)
            })
        })
    })

    describe('toJSON()', () => {
        context('when toJSON() is executed', () => {
            it('should return a JSON from a complete PushMessage', () => {
                const pushMessage: PushMessage = new PushMessage().fromJSON(pushMessageJSON)
                const result: any = pushMessage.toJSON()

                assert.propertyVal(result, 'type', pushMessageJSON.type)
                assert.propertyVal(result, 'pt', pushMessageJSON.pt)
                assert.propertyVal(result, 'eng', pushMessageJSON.eng)
            })

            it('should return a JSON with all attributes equal to undefined from an incomplete PushMessage', () => {
                const result: any = new PushMessage().toJSON()

                assert.isUndefined(result.type)
                assert.isUndefined(result.pt)
                assert.isUndefined(result.eng)
            })
        })
    })
})
