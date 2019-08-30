import { injectable } from 'inversify'
import { IEntityMapper } from '../../port/entity.mapper.interface'
import { EmailEntity } from '../email.entity'
import { Email } from '../../../application/domain/model/email'
import { Address } from '../../../application/domain/model/address'
import { Attachment } from '../../../application/domain/model/attachment'

@injectable()
export class EmailEntityMapper implements IEntityMapper<Email, EmailEntity> {
    public transform(item: any): any {
        if (item instanceof Email) return this.modelToModelEntity(item)
        return this.jsonToModel(item) // json
    }

    /**
     * Convert {Email} for {EmailEntity}.
     *
     * @see Creation Date should not be mapped to the type the repository understands.
     * Because this attribute is created automatically by the database.
     * Therefore, if a null value is passed at update time, an exception is thrown.
     * @param item
     */
    public modelToModelEntity(item: Email): EmailEntity {
        const result: EmailEntity = new EmailEntity()

        if (item.id) result.id = item.id
        if (item.from) result.from = item.from.toJSON()
        if (item.reply) result.reply = item.reply.toJSON()
        result.to = item.to ? item.to.map(elem => elem.toJSON()) : []
        result.cc = item.cc ? item.cc.map(elem => elem.toJSON()) : []
        result.bcc = item.bcc ? item.bcc.map(elem => elem.toJSON()) : []
        if (item.subject) result.subject = item.subject
        if (item.text) result.text = item.text
        if (item.html) result.html = item.html
        result.attachments = item.attachments ? item.attachments.map(elem => elem.toJSON()) : []
        if (item.userId) result.user_id = item.userId

        return result
    }

    /**
     * Convert JSON for {Email}.
     *
     * @see Each attribute must be mapped only if it contains an assigned value,
     * because at some point the attribute accessed may not exist.
     * @param json
     */
    public jsonToModel(json: any): Email {
        const result: Email = new Email()
        if (!json) return result

        if (json.id !== undefined) result.id = json.id
        if (json.from !== undefined) result.from = new Address().fromJSON(json.from)
        if (json.reply !== undefined) result.reply = new Address().fromJSON(json.reply)
        if (json.to !== undefined && json.to instanceof Array) {
            result.to = json.to.map(item => new Address().fromJSON(item))
        }
        if (json.cc !== undefined && json.cc instanceof Array) {
            result.cc = json.cc.map(item => new Address().fromJSON(item))
        }
        if (json.bcc !== undefined && json.bcc instanceof Array) {
            result.bcc = json.bcc.map(item => new Address().fromJSON(item))
        }
        if (json.subject !== undefined) result.subject = json.subject
        if (json.text !== undefined) result.text = json.text
        if (json.html !== undefined) result.html = json.html
        if (json.created_at !== undefined) result.createdAt = json.created_at
        if (json.attachments !== undefined && json.attachments instanceof Array) {
            result.attachments = json.attachments.map(item => new Attachment().fromJSON(item))
        }
        if (json.user_id !== undefined) result.userId = json.user_id

        return result
    }
}
