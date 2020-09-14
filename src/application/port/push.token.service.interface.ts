import { PushToken } from '../domain/model/push.token'

export interface IPushTokenService {
    findFromUser(userId: string): Promise<any>

    createOrUpdate(item: PushToken): Promise<PushToken>

    deleteFromUser(userId: string, clientType: string): Promise<boolean>
}
