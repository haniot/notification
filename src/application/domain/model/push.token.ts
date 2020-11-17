import { Entity } from './entity'
import { IJSONSerializable } from '../utils/json.serializable.interface'
import { IJSONDeserializable } from '../utils/json.deserializable.interface'
import { JsonUtils } from '../utils/json.utils'

export class PushToken extends Entity implements IJSONSerializable, IJSONDeserializable<PushToken> {
    private _user_id?: string
    private _client_type?: string
    private _token?: string

    constructor() {
        super()
    }

    get user_id(): string | undefined {
        return this._user_id
    }

    set user_id(value: string | undefined) {
        this._user_id = value
    }

    get client_type(): string | undefined {
        return this._client_type
    }

    set client_type(value: string | undefined) {
        this._client_type = value
    }

    get token(): string | undefined {
        return this._token
    }

    set token(value: string | undefined) {
        this._token = value
    }

    public fromJSON(json: any): PushToken {
        if (!json) return this
        if (typeof json === 'string' && JsonUtils.isJsonString(json)) {
            json = JSON.parse(json)
        }

        if (json.id !== undefined) super.id = json.id
        if (json.user_id !== undefined) this.user_id = json.user_id
        if (json.client_type !== undefined) this.client_type = json.client_type
        if (json.token !== undefined) this.token = json.token
        return this
    }

    public toJSON(): any {
        return {
            id: super.id,
            user_id: this.user_id,
            client_type: this.client_type,
            token: this.token
        }
    }
}

export enum PushTokenClientTypes {
    WEB = 'web',
    MOBILE = 'mobile'
}
