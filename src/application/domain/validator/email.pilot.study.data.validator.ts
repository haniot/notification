import { ValidationException } from '../exception/validation.exception'
import { EmailToValidator } from './email.to.validator'
import { Strings } from '../../../utils/strings'

export class EmailPilotStudyDataValidator {
    public static validate(email: any): void | ValidationException {
        const fields: Array<string> = []

        // validate null
        if (!email.to) fields.push('to')
        else EmailToValidator.validate(email.to)

        if (!email.pilot_study) fields.push('pilot_study')
        if (!email.request_date) fields.push('request_date')
        if (!email.action_url) fields.push('action_url')

        if (!email.attachments) fields.push('attachments')
        else if (!email.attachments.length) {
            throw new ValidationException(Strings.ERROR_MESSAGE.VALIDATE.EMPTY_ATTACHMENTS)
        } else {
            for (const item of email.attachments) {
                if (!item.filename) fields.push('attachments.filename')
                if (!item.path) fields.push('attachments.path')
                if (!item.content_type) fields.push('attachments.content_type')
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
