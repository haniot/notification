import { Entity } from './entity'

export class PushTokenEntity extends Entity{
    public user_id?: string
    public client_type?: string
    public token?: string
}
