import { IJSONSerializable } from '../utils/json.serializable.interface'
import { Entity } from './entity'
import { IJSONDeserializable } from '../utils/json.deserializable.interface'

export class User extends Entity implements IJSONSerializable, IJSONDeserializable<User> {
    private _type?: string

    constructor() {
        super()
    }

    get type(): string | undefined {
        return this._type
    }

    set type(value: string | undefined) {
        this._type = value
    }

    public fromJSON(json: any): User {
        if (json.id) super.id = json.id
        if (json.type) this.type = json.type
        return this
    }

    public toJSON(): any {
        return {
            id: super.id,
            type: this._type
        }
    }
}
