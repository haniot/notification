import { IRepository } from './repository.interface'
import { PushNotification } from '../domain/model/push.notification'

export interface IPushNotificationRepository extends IRepository<PushNotification> {
    updateTokenReadStatus(id: string, is_read: string): Promise<boolean>
}
