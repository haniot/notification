import { ValidationException } from '../exception/validation.exception'
import { EmailToValidator } from './email.to.validator'

export class EmailWelcomeValidator {
    public static validate(email: any): void | ValidationException {
        const fields: Array<string> = []

        // validate null
        if (!email.to) fields.push('to')
        else EmailToValidator.validate(email.to)

        if (!email.action_url) fields.push('action_url')

        if (fields.length > 0) {
            throw new ValidationException('Required fields were not provided...',
                'Email validation: '.concat(fields.join(', ')).concat(' is required!'))
        }
    }
}
