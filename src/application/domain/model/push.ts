import { Entity } from './entity'
import { IJSONSerializable } from '../utils/json.serializable.interface'
import { IJSONDeserializable } from '../utils/json.deserializable.interface'
import { PushMessage } from './push.message'
import { JsonUtils } from '../utils/json.utils'

export class Push extends Entity implements IJSONSerializable, IJSONDeserializable<Push> {
    private _type?: string
    private _keep_it?: string
    private _is_read?: string
    private _to?: Array<string>
    private _message?: PushMessage
    private _createdAt?: string
    private _user_id?: string

    constructor() {
        super()
    }

    get type(): string | undefined {
        return this._type
    }

    set type(value: string | undefined) {
        this._type = value
    }

    get keep_it(): string | undefined {
        return this._keep_it
    }

    set keep_it(value: string | undefined) {
        this._keep_it = value
    }

    get is_read(): string | undefined {
        return this._is_read
    }

    set is_read(value: string | undefined) {
        this._is_read = value
    }

    get to(): Array<string> | undefined {
        return this._to
    }

    set to(value: Array<string> | undefined) {
        this._to = value
    }

    get message(): PushMessage | undefined {
        return this._message
    }

    set message(value: PushMessage | undefined) {
        this._message = value
    }

    get createdAt(): string | undefined {
        return this._createdAt
    }

    set createdAt(value: string | undefined) {
        this._createdAt = value
    }

    get user_id(): string | undefined {
        return this._user_id
    }

    set user_id(value: string | undefined) {
        this._user_id = value
    }

    public fromJSON(json: any): Push {
        if (!json) return this

        if (typeof json === 'string' && JsonUtils.isJsonString(json)) {
            json = JSON.parse(json)
        }

        if (json.id !== undefined) super.id = json.id
        if (json.type !== undefined) this.type = json.type
        if (json.keep_it !== undefined) this.keep_it = json.keep_it
        if (json.is_read !== undefined) this.is_read = json.is_read
        if (json.to !== undefined && json.to instanceof Array) this.to = json.to
        if (json.message !== undefined) this.message = new PushMessage().fromJSON(json.message)
        if (json.user_id !== undefined) this.user_id = json.user_id

        return this
    }

    public toJSON(): any {
        return {
            id: super.id,
            type: this.type,
            keep_it: this.keep_it,
            is_read: this.is_read,
            to: this.to?.length ? this.to : undefined,
            message: this.message?.toJSON(),
            created_at: this.createdAt,
            user_id: this.user_id
        }
    }
}

export enum PushTypes {
    DIRECT = 'direct',
    TOPIC = 'topic'
}
