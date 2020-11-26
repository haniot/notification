import { IJSONSerializable } from '../utils/json.serializable.interface'
import { IJSONDeserializable } from '../utils/json.deserializable.interface'
import { JsonUtils } from '../utils/json.utils'

/**
 * Implementation of the address entity.
 *
 * @extends {Entity}
 * @implements {IJSONSerializable, IJSONDeserializable<Address>}
 */
export class Address implements IJSONSerializable, IJSONDeserializable<Address> {
    private _name!: string
    private _email!: string

    constructor(name?: string, email?: string) {
        if (name) this.name = name
        if (email) this.email = email
    }

    get name(): string {
        return this._name
    }

    set name(value: string) {
        this._name = value
    }

    get email(): string {
        return this._email
    }

    set email(value: string) {
        this._email = value
    }

    public fromJSON(json: any): Address {
        if (!json) return this
        if (JsonUtils.isJsonString(json)) {
            json = JSON.parse(json)
        }
        if (json.name !== undefined) this.name = json.name
        if (json.email !== undefined) this.email = json.email

        return this
    }

    public toJSON(): any {
        return {
            name: this.name,
            email: this.email
        }
    }
}
