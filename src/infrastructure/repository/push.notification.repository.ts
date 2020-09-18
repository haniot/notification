import { BaseRepository } from './base/base.repository'
import { PushNotification } from '../../application/domain/model/push.notification'
import { PushNotificationEntity } from '../entity/push.notification.entity'
import { IPushNotificationRepository } from '../../application/port/push.notification.repository.interface'
import { inject, injectable } from 'inversify'
import { Identifier } from '../../di/identifiers'
import { ILogger } from '../../utils/custom.logger'

@injectable()
export class PushNotificationRepository extends BaseRepository<PushNotification, PushNotificationEntity>
    implements IPushNotificationRepository {

    constructor(
        @inject(Identifier.PUSH_NOTIFICATION_REPO_MODEL) readonly _model: any,
        @inject(Identifier.PUSH_NOTIFICATION_ENTITY_MAPPER) readonly _mapper: any,
        @inject(Identifier.LOGGER) readonly _logger: ILogger
    ) {
        super(_model, _mapper, _logger)
    }

    public updateTokenReadStatus(id: string, is_read: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.Model.findOneAndUpdate({ _id: id }, { $set: { is_read } })
                .then(res => resolve(!!res))
                .catch(err => reject(this.mongoDBErrorListener(err)))
        })
    }
}
