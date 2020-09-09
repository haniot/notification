import { IJSONSerializable } from '../utils/json.serializable.interface'
import { IJSONDeserializable } from '../utils/json.deserializable.interface'
import { JsonUtils } from '../utils/json.utils'

export class File implements IJSONSerializable, IJSONDeserializable<File> {
    private _filename?: string
    private _buffer?: Buffer
    private _mimetype?: string
    private _download_link?: string

    get filename(): string | undefined {
        return this._filename
    }

    set filename(value: string | undefined) {
        this._filename = value
    }

    get buffer(): Buffer | undefined {
        return this._buffer
    }

    set buffer(value: Buffer | undefined) {
        this._buffer = value
    }

    get mimetype(): string | undefined {
        return this._mimetype
    }

    set mimetype(value: string | undefined) {
        this._mimetype = value
    }

    get download_link(): string | undefined {
        return this._download_link
    }

    set download_link(value: string | undefined) {
        this._download_link = value
    }

    public fromJSON(json: any): File {
        if (!json) return this
        if (JsonUtils.isJsonString(json)) {
            json = JSON.parse(json)
        }
        if (json.filename !== undefined) this.filename = json.filename
        if (json.buffer !== undefined) this.buffer = json.buffer
        if (json.mimetype !== undefined) this.mimetype = json.mimetype
        if (json.download_link !== undefined) this.download_link = json.download_link
        return this
    }

    public toJSON(): any {
        return {
            filename: this.filename,
            buffer: this.buffer,
            mimetype: this.mimetype,
            download_link: this.download_link
        }
    }
}

export enum FileFormatType {
    OCTET_STREAM = 'application/octet-stream'
}
