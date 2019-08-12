import { EventType, IntegrationEvent } from './integration.event'
import { User } from '../../domain/model/User'

export class UserDeleteEvent extends IntegrationEvent<any> {
    constructor(public timestamp?: Date, public user?: User) {
        super('UserDeleteEvent', EventType.USER, timestamp)
    }

    public toJSON(): any {
        if (!this.user) return {}
        return {
            ...super.toJSON(),
            user: this.user.toJSON()
        }
    }
}
