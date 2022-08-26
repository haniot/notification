import { injectable } from 'inversify'
import { IEntityMapper } from '../../port/entity.mapper.interface'
import { Push } from '../../../application/domain/model/push'
import { PushEntity } from '../push.entity'
import { PushMessage } from '../../../application/domain/model/push.message'

@injectable()
export class PushEntityMapper implements IEntityMapper<Push, PushEntity> {
    public transform(item: any): any {
        if (item instanceof Push) return this.modelToModelEntity(item)
        return this.jsonToModel(item) // json
    }

    public modelToModelEntity(item: Push): PushEntity {
        const result: PushEntity = new PushEntity()

        if (item.id !== undefined) result.id = item.id
        if (item.type !== undefined) result.type = item.type
        if (item.timestamp !== undefined) result.timestamp = new Date(item.timestamp)
        if (item.keep_it !== undefined) result.keep_it = item.keep_it
        if (item.is_read !== undefined) result.is_read = item.is_read
        if (item.to !== undefined) result.to = item.to
        if (item.message !== undefined) result.message = item.message.toJSON()
        if (item.extra !== undefined) result.extra = item.extra
        if (item.user_id !== undefined) result.user_id = item.user_id

        return result
    }

    public jsonToModel(json: any): Push {
        const result: Push = new Push()
        if (!json) return result

        if (json.id !== undefined) result.id = json.id
        if (json.created_at !== undefined) result.createdAt = json.created_at
        if (json.type !== undefined) result.type = json.type
        if (json.timestamp !== undefined) result.timestamp = json.timestamp.toISOString()
        if (json.keep_it !== undefined) result.keep_it = json.keep_it
        if (json.is_read !== undefined) result.is_read = json.is_read
        if (json.to !== undefined) result.to = json.to
        if (json.message !== undefined) result.message = new PushMessage().fromJSON(json.message)
        if (json.extra !== undefined) result.extra = json.extra
        if (json.user_id !== undefined) result.user_id = json.user_id

        return result
    }
}
