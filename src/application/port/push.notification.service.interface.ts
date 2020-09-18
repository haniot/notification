import { PushNotification } from '../domain/model/push.notification'
import { IService } from './service.interface'

export interface IPushNotificationService extends IService<PushNotification> {
    send(item: PushNotification): Promise<PushNotification>

    confirmPushRead(id: string): Promise<boolean>
}
