import { IntegrationEvent } from '../../../src/application/integration-event/event/integration.event'
import { Push } from '../../../src/application/domain/model/push'

export class GenericPushSendEventMock extends IntegrationEvent<Push> {
    public static readonly ROUTING_KEY: string = 'generic.event'
    public static readonly NAME: string = 'GenericPushSendEvent'

    constructor(public timestamp?: Date, public push?: Push) {
        super(GenericPushSendEventMock.NAME, 'generic', timestamp)
    }

    public toJSON(): any {
        if (!this.push) return {}
        return {
            ...super.toJSON(),
            push: this.push.toJSON()
        }
    }
}
