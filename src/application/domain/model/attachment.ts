import { IJSONSerializable } from '../utils/json.serializable.interface'
import { IJSONDeserializable } from '../utils/json.deserializable.interface'
import { JsonUtils } from '../utils/json.utils'

/**
 * Implementation of the attachment entity.
 *
 * @extends {Entity}
 * @implements {IJSONSerializable, IJSONDeserializable<Attachment>}
 */
export class Attachment implements IJSONSerializable, IJSONDeserializable<Attachment> {
    private _filename!: string
    private _path!: string
    private _contentType?: string

    constructor() {
        // Not implemented!
    }

    get filename(): string {
        return this._filename
    }

    set filename(value: string) {
        this._filename = value
    }

    get path(): string {
        return this._path
    }

    set path(value: string) {
        this._path = value
    }

    get contentType(): string | undefined {
        return this._contentType
    }

    set contentType(value: string | undefined) {
        this._contentType = value
    }

    public fromJSON(json: any): Attachment {
        if (JsonUtils.isJsonString(json)) {
            json = JSON.parse(json)
        }
        if (json.filename !== undefined) this.filename = json.filename
        if (json.path !== undefined) this.path = json.path
        if (json.content_type !== undefined) this.contentType = json.content_type

        return this
    }

    public toJSON(): any {
        return {
            filename: this.filename,
            path: this.path,
            content_type: this.contentType
        }
    }
}
