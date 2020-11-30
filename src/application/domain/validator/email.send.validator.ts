import { ValidationException } from '../exception/validation.exception'
import { Email } from '../model/email'
import { EmailValidator } from './email.validator'
import { Strings } from '../../../utils/strings'

export class EmailSendValidator {
    public static validate(email: Email): void | ValidationException {
        const fields: Array<string> = []

        // validate null
        if (!email.subject) fields.push('subject')
        if (email.reply) {
            if (!email.reply.email) {
                throw new ValidationException(Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_REPLY_EMAIL)
            }
            EmailValidator.validate(email.reply.email)
        }
        if (!email.to) fields.push('to')
        else if (!email.to.length) {
            throw new ValidationException(Strings.ERROR_MESSAGE.VALIDATE.EMPTY_TO)
        } else {
            for (const item of email.to) {
                if (!item.email) {
                    throw new ValidationException(Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_TO_EMAIL)
                } else {
                    EmailValidator.validate(item.email)
                }
            }
        }
        if (email.cc && email.cc.length) {
            for (const item of email.cc) {
                if (!item.email) {
                    throw new ValidationException(Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_CC_EMAIL)
                } else {
                    EmailValidator.validate(item.email)
                }
            }
        }
        if (email.bcc && email.bcc.length) {
            for (const item of email.bcc) {
                if (!item.email) {
                    throw new ValidationException(Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_BCC_EMAIL)
                } else {
                    EmailValidator.validate(item.email)
                }
            }
        }
        if (email.attachments && email.attachments.length) {
            for (const item of email.attachments) {
                if (!item.path) {
                    throw new ValidationException(Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_ATTACHMENTS_PATH)
                }
            }
        }

        if (fields.length > 0) {
            throw new ValidationException(
                Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS,
                Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS_DESC.replace('{0}', fields.join(', '))
            )
        }
    }
}
