import { ValidationException } from '../exception/validation.exception'
import { Email } from '../model/email'
import { EmailValidator } from './email.validator'

export class EmailSendValidator {
    public static validate(email: Email): void | ValidationException {
        const fields: Array<string> = []

        // validate null
        if (!email.subject) fields.push('subject')
        if (email.reply) {
            if (!email.reply.email) {
                throw new ValidationException('The reply field requires that the object have email!')
            }
            EmailValidator.validate(email.reply.email)
        }
        if (!email.to) fields.push('to')
        if (!email.to.length) {
            throw new ValidationException('The to field requires at least one recipient with ' +
                'and an email address!')
        } else {
            for (const item of email.to) {
                if (!item.email) {
                    throw new ValidationException('The to field requires an array of recipients ' +
                        'with a email address!.')
                } else {
                    EmailValidator.validate(item.email)
                }
            }
        }
        if (email.cc && email.cc.length) {
            for (const item of email.cc) {
                if (!item.email) {
                    throw new ValidationException('The cc field requires an array of recipients ' +
                        ' with a email address.')
                } else {
                    EmailValidator.validate(item.email)
                }
            }
        }
        if (email.bcc && email.bcc.length) {
            for (const item of email.bcc) {
                if (!item.email) {
                    throw new ValidationException('The bcc field requires an array of recipients ' +
                        'with a email address.')
                } else {
                    EmailValidator.validate(item.email)
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
