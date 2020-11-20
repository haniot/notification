import { PushToken } from '../domain/model/push.token'

export interface IPushTokenService {
    findFromUserAndType(userId: string, clientType: string): Promise<PushToken | undefined>

    createOrUpdate(item: PushToken): Promise<PushToken | undefined>

    deleteFromUser(userId: string, clientType: string): Promise<boolean>
}
