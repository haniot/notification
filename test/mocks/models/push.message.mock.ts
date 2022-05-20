import { PushMessage } from '../../../src/application/domain/model/push.message'

export class PushMessageMock {

    public generate(): PushMessage {
        const pushMessage: PushMessage = new PushMessage()
        pushMessage.type = 'notification-type'
        pushMessage.pt = {
            title: 'Isto é um título.',
            text: 'Isto é um texto.'
        }
        pushMessage.en = {
            title: 'This is a title.',
            text: 'This is a text.'
        }

        return pushMessage
    }
}
