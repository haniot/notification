import { IRepository } from './repository.interface'
import { PushToken } from '../domain/model/push.token'

export interface IPushTokenRepository extends IRepository<PushToken> {
    getUserTokens(userId: string): Promise<Array<PushToken>>

    findFromUserAndType(userId: string, clientType: string): Promise<PushToken>

    createOrUpdate(item: PushToken): Promise<PushToken>

    deleteFromUser(userId: string, clientType: string): Promise<boolean>
}
