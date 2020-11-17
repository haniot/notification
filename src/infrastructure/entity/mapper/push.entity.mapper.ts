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

        if (item.id) result.id = item.id
        if (item.type) result.type = item.type
        if (item.keep_it) result.keep_it = item.keep_it
        if (item.is_read) result.is_read = item.is_read
        if (item.to) result.to = item.to
        if (item.message) result.message = item.message.toJSON()

        return result
    }

    public jsonToModel(json: any): Push {
        const result: Push = new Push()
        if (!json) return result

        if (json.id) result.id = json.id
        if (json.type) result.type = json.type
        if (json.keep_it) result.keep_it = json.keep_it
        if (json.is_read) result.is_read = json.is_read
        if (json.to) result.to = json.to
        if (json.message) result.message = new PushMessage().fromJSON(json.message)
        if (json.created_at) result.createdAt = json.created_at

        return result
    }
}
