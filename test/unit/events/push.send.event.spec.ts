import { assert } from 'chai'
import { EventType } from '../../../src/application/integration-event/event/integration.event'
import { Push } from '../../../src/application/domain/model/push'
import { PushMock } from '../../mocks/models/push.mock'
import { PushSendEvent } from '../../../src/application/integration-event/event/push.send.event'

describe('EVENTS: PushSendEvent', () => {
    describe('toJSON()', () => {
        context('when toJSON() is executed', () => {
            it('should return a JSON from a complete PushSendEvent', () => {
                const push: Push = new PushMock().generate()
                const timestamp: Date = new Date()
                const pushSendEvent: PushSendEvent = new PushSendEvent(timestamp, push)
                const result: any = pushSendEvent.toJSON()

                assert.propertyVal(result, 'event_name', PushSendEvent.NAME)
                assert.propertyVal(result, 'timestamp', timestamp)
                assert.propertyVal(result, 'type', EventType.PUSH)
                assert.deepPropertyVal(result, 'push', push.toJSON())
            })

            it('should return a JSON with some attributes equal to undefined from a PushSendEvent ' +
                'with an incomplete Push', () => {
                const timestamp: Date = new Date()
                const pushSendEvent: PushSendEvent = new PushSendEvent(timestamp, new Push())
                const result: any = pushSendEvent.toJSON()

                assert.propertyVal(result, 'event_name', PushSendEvent.NAME)
                assert.propertyVal(result, 'timestamp', timestamp)
                assert.propertyVal(result, 'type', EventType.PUSH)
                assert.isUndefined(result.push.id)
                assert.isUndefined(result.push.type)
                assert.isUndefined(result.push.keep_it)
                assert.isUndefined(result.push.is_read)
                assert.isUndefined(result.push.to)
                assert.isUndefined(result.push.message)
            })

            it('should return an empty JSON from a PushSendEvent without Push', () => {
                const timestamp: Date = new Date()
                const pushSendEvent: PushSendEvent = new PushSendEvent(timestamp)
                const result: any = pushSendEvent.toJSON()

                assert.isEmpty(result)
            })
        })
    })
})
