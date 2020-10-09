import { Push } from '../domain/model/push'
import { IService } from './service.interface'
import { IQuery } from './query.interface'

export interface IPushService extends IService<Push> {
    send(item: Push): Promise<Push>

    confirmPushRead(id: string): Promise<boolean>

    getAllByUser(userId: string, query: IQuery): Promise<Array<Push>>
}
