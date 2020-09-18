import { IJSONSerializable } from '../utils/json.serializable.interface'
import { IJSONDeserializable } from '../utils/json.deserializable.interface'
import { JsonUtils } from '../utils/json.utils'

export class PushMessage implements IJSONSerializable, IJSONDeserializable<PushMessage> {
    private _type?: string
    private _pt?: any
    private _eng?: any

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

    get eng(): any {
        return this._eng
    }

    set eng(value: any) {
        this._eng = value
    }

    public fromJSON(json: any): PushMessage {
        if (!json) return this
        if (typeof json === 'string' && JsonUtils.isJsonString(json)) {
            json = JSON.parse(json)
        }

        if (json.type !== undefined) this.type = json.type
        if (json.pt !== undefined) this.pt = json.pt
        if (json.eng !== undefined) this.eng = json.eng

        return this
    }

    public toJSON(): any {
        return {
            type: this.type,
            pt: this.pt,
            eng: this.eng
        }
    }
}

