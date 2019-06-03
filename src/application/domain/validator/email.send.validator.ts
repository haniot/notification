import { ValidationException } from '../exception/validation.exception'
import { Email } from '../model/email'

export class EmailSendValidator {
    public static validate(email: Email): void | ValidationException {
        const fields: Array<string> = []

        // validate null
        if (!email.subject) fields.push('subject')
        if (email.reply && (!email.reply.name || !email.reply.email)) {
            throw new ValidationException('The reply field requires that the object have name and email!')
        }
        if (!email.to) fields.push('to')
        else if (!email.to.length) {
            throw new ValidationException('The to field requires at least one recipient with ' +
                'a name and an email address!')
        } else {
            for (const item of email.to) {
                if (!item.name || !item.email) {
                    throw new ValidationException('The to field requires an array of recipients ' +
                        'with a name and email address!.')
                }
            }
        }
        if (email.cc && email.cc.length) {
            for (const item of email.cc) {
                if (!item.name || !item.email) {
                    throw new ValidationException('The cc field requires an array of recipients ' +
                        ' with a name and email address.')
                }
            }
        }
        if (email.bcc && email.bcc.length) {
            for (const item of email.bcc) {
                if (!item.name || !item.email) {
                    throw new ValidationException('The bcc field requires an array of recipients ' +
                        'with a name and email address.')
                }
            }
        }
        if (email.attachments && email.attachments.length) {
            for (const item of email.attachments) {
                if (!item.path) {
                    throw new ValidationException('The attachment field requires a variety of ' +
                        'attachments with at least the file path or URL.')
                }
            }
        }

        if (fields.length > 0) {
            throw new ValidationException('Required fields were not provided...',
                'Email validation: '.concat(fields.join(', ')).concat(' is required!'))
        }
    }
}
