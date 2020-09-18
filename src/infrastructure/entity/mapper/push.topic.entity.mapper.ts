import { injectable } from 'inversify'
import { IEntityMapper } from '../../port/entity.mapper.interface'
import { PushTopic } from '../../../application/domain/model/push.topic'
import { PushTopicEntity } from '../push.topic.entity'

@injectable()
export class PushTopicEntityMapper implements IEntityMapper<PushTopic, PushTopicEntity> {
    public transform(item: any): any {
        if (item instanceof PushTopic) return this.modelToModelEntity(item)
        return this.jsonToModel(item) // json
    }

    public modelToModelEntity(item: PushTopic): PushTopicEntity {
        const result: PushTopicEntity = new PushTopicEntity()

        if (item.id !== undefined) result.id = item.id
        if (item.name !== undefined) result.to = item.name
        if (item.subscribers !== undefined) result.registration_tokens = item.subscribers

        return result
    }

    public jsonToModel(json: any): PushTopic {
        const result: PushTopic = new PushTopic()
        if (!json) return result

        if (json.id !== undefined) result.id = json.id
        if (json.to !== undefined) result.name = json.to
        if (json.registration_tokens !== undefined) result.subscribers = json.registration_tokens

        return result
    }
}
