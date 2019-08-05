import { EventType, IntegrationEvent } from './integration.event'
import { Email } from '../../domain/model/email'

export class EmailEvent extends IntegrationEvent<Email> {
    constructor(public event_name: string, public timestamp?: Date, public email?: Email) {
        super(event_name, EventType.EMAIL, timestamp)
    }

    public toJSON(): any {
        if (!this.email) return {}
        return {
            ...super.toJSON(),
            ...{ email: this.email.toJSON() }
        }
    }
}
