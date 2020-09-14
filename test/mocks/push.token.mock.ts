import { PushToken } from '../../src/application/domain/model/push.token'
import { GeneratorMock } from './generator.mock'

export class PushTokenMock extends PushToken {
    constructor(client_type: string) {
        super()
        this.client_type = client_type
        this.setDefaultValues()
    }

    private setDefaultValues() {
        super.id = GeneratorMock.generateObjectId()
        super.user_id = GeneratorMock.generateObjectId()
        super.token = GeneratorMock.generateRandomString(40)
    }
}
