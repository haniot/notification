import { assert } from 'chai'
import { Push, PushTypes } from '../../../src/application/domain/model/push'
import { PushEntityMapper } from '../../../src/infrastructure/entity/mapper/push.entity.mapper'
import { PushEntity } from '../../../src/infrastructure/entity/push.entity'
import { PushMock } from '../../mocks/models/push.mock'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'

describe('MAPPERS: PushEntityMapper', () => {
    const pushTokenEntityMapper: PushEntityMapper = new PushEntityMapper()

    // Create Push model.
    const push: Push = new PushMock().generate(PushTypes.DIRECT)

    // Create Push JSON.
    const pushJSON: any = DefaultEntityMock.PUSH

    describe('transform(item: any)', () => {
        context('when the parameter is of type Push', () => {
            it('should return a PushEntity from a complete Push', () => {
                const result: PushEntity = pushTokenEntityMapper.transform(push)

                assert.propertyVal(result, 'id', push.id)
                assert.propertyVal(result, 'type', push.type)
                assert.propertyVal(result, 'keep_it', push.keep_it)
                assert.propertyVal(result, 'is_read', push.is_read)
                assert.propertyVal(result, 'to', push.to)
                assert.propertyVal(result.message, 'type', push.message?.type)
                assert.propertyVal(result.message, 'pt', push.message?.pt)
                assert.propertyVal(result.message, 'eng', push.message?.eng)
            })

            it('should return an empty PushEntity from empty Push', () => {
                const result: PushEntity = pushTokenEntityMapper.transform(new Push())

                assert.isEmpty(result)
            })
        })

        context('when the parameter is a JSON', () => {
            it('should return a Push from a complete JSON', () => {
                const result: Push = pushTokenEntityMapper.transform(pushJSON)

                assert.propertyVal(result, 'id', pushJSON.id)
                assert.propertyVal(result, 'type', pushJSON.type)
                assert.propertyVal(result, 'keep_it', pushJSON.keep_it)
                assert.propertyVal(result, 'is_read', pushJSON.is_read)
                assert.propertyVal(result, 'to', pushJSON.to)
                assert.propertyVal(result.message, 'type', pushJSON.message.type)
                assert.propertyVal(result.message, 'pt', pushJSON.message.pt)
                assert.propertyVal(result.message, 'eng', pushJSON.message.eng)
            })

            it('should return a Push with some attributes equal to undefined from an empty JSON', () => {
                const result: Push = pushTokenEntityMapper.transform({})

                assert.isUndefined(result.id)
            })
        })

        context('when the parameter is undefined', () => {
            it('should return a Push with some attributes equal to undefined from undefined json', () => {
                const result: Push = pushTokenEntityMapper.transform(undefined)

                assert.isUndefined(result.id)
            })
        })
    })
})
