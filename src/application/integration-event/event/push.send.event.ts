import { EventType, IntegrationEvent } from './integration.event'
import { Push } from '../../domain/model/push'

export class PushSendEvent extends IntegrationEvent<Push> {

    public static readonly ROUTING_KEY: string = 'pushes.send'
    public static readonly NAME: string = 'PushSendEvent'

    constructor(public timestamp?: Date, public push?: Push) {
        super(PushSendEvent.NAME, EventType.PUSH, timestamp)
    }

    public toJSON(): any {
        if (!this.push) return {}
        return {
            ...super.toJSON(),
            push: this.push.toJSON()
        }
    }
}
