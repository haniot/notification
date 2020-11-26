import { Entity } from './entity'
import { IJSONSerializable } from '../utils/json.serializable.interface'
import { IJSONDeserializable } from '../utils/json.deserializable.interface'
import { Address } from './address'
import { Attachment } from './attachment'
import { JsonUtils } from '../utils/json.utils'

/**
 * Implementation of the email entity.
 *
 * @extends {Entity}
 * @implements {IJSONSerializable, IJSONDeserializable<Email>}
 */
export class Email extends Entity implements IJSONSerializable, IJSONDeserializable<Email> {
    private _from!: Address
    private _reply?: Address
    private _to!: Array<Address> // required
    private _cc?: Array<Address>
    private _bcc?: Array<Address>
    private _subject!: string // required
    private _text?: string
    private _html?: string
    private _attachments?: Array<Attachment>
    private _createdAt?: string
    private _userId!: string // required
    private _template: string
    private _link?: string

    constructor() {
        super()
        this._template = 'default'
    }

    get from(): Address {
        return this._from
    }

    set from(value: Address) {
        this._from = value
    }

    get reply(): Address | undefined {
        return this._reply
    }

    set reply(value: Address | undefined) {
        this._reply = value
    }

    get to(): Array<Address> {
        return this._to
    }

    set to(value: Array<Address>) {
        this._to = value
    }

    get cc(): Array<Address> | undefined {
        return this._cc
    }

    set cc(value: Array<Address> | undefined) {
        this._cc = value
    }

    get bcc(): Array<Address> | undefined {
        return this._bcc
    }

    set bcc(value: Array<Address> | undefined) {
        this._bcc = value
    }

    get subject(): string {
        return this._subject
    }

    set subject(value: string) {
        this._subject = value
    }

    get text(): string | undefined {
        return this._text
    }

    set text(value: string | undefined) {
        this._text = value
    }

    get html(): string | undefined {
        return this._html
    }

    set html(value: string | undefined) {
        this._html = value
    }

    get attachments(): Array<Attachment> | undefined {
        return this._attachments
    }

    set attachments(value: Array<Attachment> | undefined) {
        this._attachments = value
    }

    get createdAt(): string | undefined {
        return this._createdAt
    }

    set createdAt(value: string | undefined) {
        this._createdAt = value
    }

    get userId(): string {
        return this._userId
    }

    set userId(value: string) {
        this._userId = value
    }

    get template(): string {
        return this._template
    }

    set template(value: string) {
        this._template = value
    }

    get link(): string | undefined {
        return this._link
    }

    set link(value: string | undefined) {
        this._link = value
    }

    public toJSON(): any {
        return {
            id: super.id,
            reply: this.reply ? this.reply.toJSON() : this.reply,
            to: this.to ? this.to.map(item => item.toJSON()) : [],
            cc: this.cc ? this.cc.map(item => item.toJSON()) : [],
            bcc: this.bcc ? this.bcc.map(item => item.toJSON()) : [],
            subject: this.subject,
            text: this.text,
            html: this.html,
            attachments: this.attachments ? this.attachments.map(item => item.toJSON()) : [],
            created_at: this.createdAt
        }
    }

    public fromJSON(json: any): Email {
        if (!json) return this
        if (JsonUtils.isJsonString(json)) {
            json = JSON.parse(json)
        }
        if (json.id !== undefined) super.id = json.id
        if (json.from !== undefined) this.from = new Address().fromJSON(json.from)
        if (json.reply !== undefined) this.reply = new Address().fromJSON(json.reply)
        if (json.to !== undefined && json.to instanceof Array) {
            this.to = json.to.map(item => new Address().fromJSON(item))
        }
        if (json.cc !== undefined && json.cc instanceof Array) {
            this.cc = json.cc.map(item => new Address().fromJSON(item))
        }
        if (json.bcc !== undefined && json.bcc instanceof Array) {
            this.bcc = json.bcc.map(item => new Address().fromJSON(item))
        }
        if (json.subject !== undefined) this.subject = json.subject
        if (json.text !== undefined) this.text = json.text
        if (json.html !== undefined) this.html = json.html
        if (json.created_at !== undefined) this.createdAt = json.created_at
        if (json.attachments !== undefined && json.attachments instanceof Array) {
            this.attachments = json.attachments.map(item => new Attachment().fromJSON(item))
        }
        if (json.user_id !== undefined) this.userId = json.user_id
        if (json.template !== undefined) this.template = json.template
        if (json.link !== undefined) this.link = json.link

        return this
    }
}
