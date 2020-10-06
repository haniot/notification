import { Push } from '../domain/model/push'
import { IService } from './service.interface'

export interface IPushService extends IService<Push> {
    send(item: Push): Promise<Push>

    confirmPushRead(id: string): Promise<boolean>
}
