import { IJSONSerializable } from '../utils/json.serializable.interface'
import { IJSONDeserializable } from '../utils/json.deserializable.interface'
import { JsonUtils } from '../utils/json.utils'
import { File } from './file'

export class EmailTemplate implements IJSONSerializable, IJSONDeserializable<EmailTemplate> {
    private _type?: string
    private _html?: File
    private _subject?: File
    private _text?: File

    get type(): string | undefined {
        return this._type
    }

    set type(value: string | undefined) {
        this._type = value
    }

    get html(): File | undefined {
        return this._html
    }

    set html(value: File | undefined) {
        this._html = value
    }

    get subject(): File | undefined {
        return this._subject
    }

    set subject(value: File | undefined) {
        this._subject = value
    }

    get text(): File | undefined {
        return this._text
    }

    set text(value: File | undefined) {
        this._text = value
    }

    public fromJSON(json: any): EmailTemplate {
        if (!json) return this
        if (JsonUtils.isJsonString(json)) {
            json = JSON.parse(json)
        }
        if (json.type !== undefined) this.type = json.type
        if (json.html !== undefined) this.html = new File().fromJSON(json.html)
        if (json.subject !== undefined) this.subject = new File().fromJSON(json.subject)
        if (json.text !== undefined) this.text = new File().fromJSON(json.text)
        return this
    }

    public toJSON(): any {
        return {
            type: this.type,
            html: this.html?.toJSON(),
            subject: this.subject?.toJSON(),
            text: this.text?.toJSON()
        }
    }
}

export enum EmailTemplateTypes {
    WELCOME = 'welcome',
    RESET_PASSWORD = 'reset-password',
    UPDATED_PASSWORD = 'updated-password',
    PILOT_STUDY_DATA = 'pilot-study-data'
}

export enum EmailTemplateResources {
    HTML = 'html',
    SUBJECT = 'subject',
    TEXT = 'text'
}
