import { IJSONSerializable } from '../utils/json.serializable.interface'
import { IJSONDeserializable } from '../utils/json.deserializable.interface'
import { JsonUtils } from '../utils/json.utils'

export class PushMessage implements IJSONSerializable, IJSONDeserializable<PushMessage> {
    private _type?: string
    private _pt?: any
    private _en?: any

    get type(): string | undefined {
        return this._type
    }

    set type(value: string | undefined) {
        this._type = value
    }

    get pt(): any {
        return this._pt
    }

    set pt(value: any) {
        this._pt = value
    }

    get en(): any {
        return this._en
    }

    set en(value: any) {
        this._en = value
    }

    public fromJSON(json: any): PushMessage {
        if (!json) return this
        if (typeof json === 'string' && JsonUtils.isJsonString(json)) {
            json = JSON.parse(json)
        }

        if (json.type !== undefined) this.type = json.type
        if (json.pt !== undefined) this.pt = json.pt
        if (json.en !== undefined) this.en = json.en

        return this
    }

    public toJSON(): any {
        return {
            type: this.type,
            pt: this.pt,
            en: this.en
        }
    }
}