import { NotificationTypes, PushNotification } from '../../src/application/domain/model/push.notification'
import { GeneratorMock } from './generator.mock'
import { ChoiceTypes } from '../../src/application/domain/utils/choice.types'
import { PushMessage } from '../../src/application/domain/model/push.message'

export class PushNotificationMock extends PushNotification {
    constructor(type: string, to?: Array<string>) {
        super()
        this.type = type
        if (to) this.to = to
        this.setDefaultValues()
    }

    private setDefaultValues() {
        super.id = GeneratorMock.generateObjectId()
        this.keep_it = this.type === NotificationTypes.DIRECT ? ChoiceTypes.YES : ChoiceTypes.NO
        if (this.keep_it === ChoiceTypes.YES) this.is_read = ChoiceTypes.NO
        this.message = new PushMessage().fromJSON({
            type: 'notification-type',
            pt: {
                title: 'Isto é um título.',
                text: 'Isto é um texto.'
            },
            eng: {
                title: 'This is a title.',
                text: 'This is a text.'
            }
        })
    }
}
