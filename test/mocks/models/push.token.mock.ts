import { PushToken, PushTokenClientTypes } from '../../../src/application/domain/model/push.token'
import { GeneratorMock } from '../generator.mock'

export class PushTokenMock {

    public generate(clientType?: string): PushToken {
        const pushToken: PushToken = new PushToken()
        pushToken.id = GeneratorMock.generateObjectId()
        pushToken.user_id = GeneratorMock.generateObjectId()
        pushToken.client_type = clientType ? clientType : this.generateClientType()
        pushToken.token = GeneratorMock.generateRandomString(40)

        return pushToken
    }

    private generateClientType(): PushTokenClientTypes {
        const clientTypes = {
            0: PushTokenClientTypes.WEB,
            1: PushTokenClientTypes.MOBILE
        }

        return clientTypes[Math.floor((Math.random() * 2))] // 0-1
    }
}
