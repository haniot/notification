import { GeneratorMock } from '../generator.mock'
import { PushTokenClientTypes } from '../../../src/application/domain/model/push.token'
import { PushTypes } from '../../../src/application/domain/model/push'
import { ChoiceTypes } from '../../../src/application/domain/utils/choice.types'

export abstract class DefaultEntityMock {
    // MODELS
    public static readonly PUSH_MESSAGE: any = {
        type: 'notification-type',
        pt: {
            title: 'Isto é um título.',
            text: 'Isto é um texto.'
        },
        eng: {
            title: 'This is a title.',
            text: 'This is a text.'
        }
    }

    public static readonly PUSH_TOKEN: any = {
        id: GeneratorMock.generateObjectId(),
        user_id: GeneratorMock.generateObjectId(),
        client_type: PushTokenClientTypes.MOBILE,
        token: GeneratorMock.generateRandomString(40)
    }

    public static readonly PUSH: any = {
        id: GeneratorMock.generateObjectId(),
        type: PushTypes.DIRECT,
        keep_it: ChoiceTypes.YES,
        is_read: ChoiceTypes.NO,
        to: [GeneratorMock.generateObjectId()],
        message: DefaultEntityMock.PUSH_MESSAGE,
        created_at: '2020-11-18T02:40:10.752Z'
    }
}
