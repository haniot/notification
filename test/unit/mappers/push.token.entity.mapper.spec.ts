import { assert } from 'chai'
import { PushToken } from '../../../src/application/domain/model/push.token'
import { PushTokenEntityMapper } from '../../../src/infrastructure/entity/mapper/push.token.entity.mapper'
import { PushTokenEntity } from '../../../src/infrastructure/entity/push.token.entity'
import { PushTokenMock } from '../../mocks/models/push.token.mock'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'

describe('MAPPERS: PushTokenEntityMapper', () => {
    const pushTokenEntityMapper: PushTokenEntityMapper = new PushTokenEntityMapper()

    // Create PushToken model.
    const pushToken: PushToken = new PushTokenMock().generate()

    // Create PushToken JSON.
    const pushTokenJSON: any = DefaultEntityMock.PUSH_TOKEN

    describe('transform(item: any)', () => {
        context('when the parameter is of type PushToken', () => {
            it('should return a PushTokenEntity from a complete PushToken', () => {
                const result: PushTokenEntity = pushTokenEntityMapper.transform(pushToken)

                assert.propertyVal(result, 'id', pushToken.id)
                assert.propertyVal(result, 'user_id', pushToken.user_id)
                assert.propertyVal(result, 'client_type', pushToken.client_type)
                assert.propertyVal(result, 'token', pushToken.token)
            })

            it('should return an empty PushTokenEntity from empty PushToken', () => {
                const result: PushTokenEntity = pushTokenEntityMapper.transform(new PushToken())

                assert.isEmpty(result)
            })
        })

        context('when the parameter is a JSON', () => {
            it('should return a PushToken from a complete JSON', () => {
                const result: PushToken = pushTokenEntityMapper.transform(pushTokenJSON)

                assert.propertyVal(result, 'id', pushTokenJSON.id)
                assert.propertyVal(result, 'user_id', pushTokenJSON.user_id)
                assert.propertyVal(result, 'client_type', pushTokenJSON.client_type)
                assert.propertyVal(result, 'token', pushTokenJSON.token)
            })

            it('should return a PushToken with some attributes equal to undefined from an empty JSON', () => {
                const result: PushToken = pushTokenEntityMapper.transform({})

                assert.isUndefined(result.id)
            })
        })

        context('when the parameter is undefined', () => {
            it('should return a PushToken with some attributes equal to undefined from undefined json', () => {
                const result: PushToken = pushTokenEntityMapper.transform(undefined)

                assert.isUndefined(result.id)
            })
        })
    })
})
