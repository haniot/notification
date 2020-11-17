import { PushToken } from '../domain/model/push.token'

export interface IPushTokenService {
    findFromUserAndType(userId: string, clientType: string): Promise<PushToken>

    createOrUpdate(item: PushToken): Promise<PushToken>

    deleteFromUser(userId: string, clientType: string): Promise<boolean>
}
