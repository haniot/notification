import { EventType, IntegrationEvent } from './integration.event'
import { User } from '../../domain/model/User'

export class UserDeleteEvent extends IntegrationEvent<any> {
    public static readonly ROUTING_KEY: string = 'users.delete'
    public static readonly NAME: string = 'UserDeleteEvent'

    constructor(public timestamp?: Date, public user?: User) {
        super(UserDeleteEvent.NAME, EventType.USER, timestamp)
    }

    public toJSON(): any {
        if (!this.user) return {}
        return {
            ...super.toJSON(),
            user: this.user.toJSON()
        }
    }
}
