import { IJSONSerializable } from '../utils/json.serializable.interface'
import { IJSONDeserializable } from '../utils/json.deserializable.interface'
import { Entity } from './entity'
import { JsonUtils } from '../utils/json.utils'

export class PushTopic extends Entity implements IJSONSerializable, IJSONDeserializable<PushTopic> {
    private _name?: string
    private _subscribers?: Array<string>

    constructor() {
        super()
    }

    get name(): string | undefined {
        return this._name
    }

    set name(value: string | undefined) {
        this._name = value
    }

    get subscribers(): Array<string> | undefined {
        return this._subscribers
    }

    set subscribers(value: Array<string> | undefined) {
        this._subscribers = value
    }

    public fromJSON(json: any): PushTopic {
        if (!json) return this
        if (typeof json === 'string' && JsonUtils.isJsonString(json)) {
            json = JSON.parse(json)
        }

        if (json.id !== undefined) super.id = json.id
        if (json.name !== undefined) this.name = json.name
        if (json.subscribers !== undefined && json.subscribers instanceof Array) {
            this.subscribers = json.subscribers
        }

        return this
    }

    public toJSON(): any {
        return {
            id: super.id,
            name: this.name,
            subscribers: this.subscribers?.length ? this.subscribers : []
        }
    }
}
