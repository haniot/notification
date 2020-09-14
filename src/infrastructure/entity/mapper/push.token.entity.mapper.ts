import { injectable } from 'inversify'
import { IEntityMapper } from '../../port/entity.mapper.interface'
import { PushToken } from '../../../application/domain/model/push.token'
import { PushTokenEntity } from '../push.token.entity'

@injectable()
export class PushTokenEntityMapper implements IEntityMapper<PushToken, PushTokenEntity> {
    public transform(item: any): any {
        if (item instanceof PushToken) return this.modelToModelEntity(item)
        return this.jsonToModel(item) // json
    }

    public modelToModelEntity(item: PushToken): PushTokenEntity {
        const result: PushTokenEntity = new PushTokenEntity()

        if (item.id) result.id = item.id
        if (item.user_id) result.user_id = item.user_id
        if (item.client_type) result.client_type = item.client_type
        if (item.token) result.token = item.token

        return result
    }

    public jsonToModel(json: any): PushToken {
        const result: PushToken = new PushToken()
        if (!json) return result

        if (json.id !== undefined) result.id = json.id
        if (json.user_id !== undefined) result.user_id = json.user_id
        if (json.client_type !== undefined) result.client_type = json.client_type
        if (json.token !== undefined) result.token = json.token

        return result
    }
}
