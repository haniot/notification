import { ValidationException } from '../exception/validation.exception'
import { EmailTemplate } from '../model/email.template'
import { EmailTemplateTypesValidator } from './email.template.types.validator'

export class EmailTemplateValidator {
    public static validate(item: EmailTemplate): void | ValidationException {
        const fields: Array<string> = []
        const validate_item = file => {
            const file_extension: string = file.filename?.split('.')[1]
            if (file_extension !== 'pug') {
                throw new ValidationException(
                    `Invalid extension from file: ${file.filename}`,
                    'Only .pug files are allowed.')
            }
        }

        if (!item.type) fields.push('type')
        else EmailTemplateTypesValidator.validate(item.type)
        if (!item.html || !item.html.filename || !item.html.buffer || !item.html.mimetype) fields.push('html')
        else validate_item(item.html)
        if (!item.subject || !item.subject.filename || !item.subject.buffer || !item.subject.mimetype) fields.push('subject')
        else validate_item(item.subject)
        if (!item.text || !item.text.filename || !item.text.buffer || !item.text.mimetype) fields.push('text')
        else validate_item(item.text)

        if (fields.length > 0) {
            throw new ValidationException(
                'Required fields were not provided...',
                `EmailTemplate: ${fields.join(', ')} required.`)
        }
    }
}
