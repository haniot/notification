import { IRepository } from './repository.interface'
import { Push } from '../domain/model/push'

export interface IPushRepository extends IRepository<Push> {
    updateTokenReadStatus(id: string, is_read: string): Promise<boolean>

    send(push: Push): Promise<void>
}
