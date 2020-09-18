import { injectable } from 'inversify'
import { IEntityMapper } from '../../port/entity.mapper.interface'
import { PushNotification } from '../../../application/domain/model/push.notification'
import { PushNotificationEntity } from '../push.notification.entity'
import { PushMessage } from '../../../application/domain/model/push.message'

@injectable()
export class PushNotificationEntityMapper implements IEntityMapper<PushNotification, PushNotificationEntity> {
    public transform(item: any): any {
        if (item instanceof PushNotification) return this.modelToModelEntity(item)
        return this.jsonToModel(item) // json
    }

    public modelToModelEntity(item: PushNotification): PushNotificationEntity {
        const result: PushNotificationEntity = new PushNotificationEntity()

        if (item.id) result.id = item.id
        if (item.type) result.type = item.type
        if (item.keep_it) result.keep_it = item.keep_it
        if (item.is_read) result.is_read = item.is_read
        if (item.to) result.to = item.to
        if (item.message) result.message = item.message.toJSON()

        return result
    }

    public jsonToModel(json: any): PushNotification {
        const result: PushNotification = new PushNotification()
        if (!json) return result

        if (json.id) result.id = json.id
        if (json.type) result.type = json.type
        if (json.keep_it) result.keep_it = json.keep_it
        if (json.is_read) result.is_read = json.is_read
        if (json.to) result.to = json.to
        if (json.message) result.message = new PushMessage().fromJSON(json.message)

        return result
    }
}
