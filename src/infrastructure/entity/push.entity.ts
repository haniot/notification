import { Entity } from './entity'

export class PushEntity extends Entity {
    public type?: string
    public timestamp?: Date
    public keep_it?: string
    public is_read?: string
    public to?: Array<string>
    public message?: any
    public extra?: string
    public user_id?: string
}
