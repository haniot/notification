import { ValidationException } from '../exception/validation.exception'
import { EmailValidator } from './email.validator'

export class EmailResetPasswordValidator {
    public static validate(email: any): void | ValidationException {
        const fields: Array<string> = []
        const INVALID_TO: string = 'The "to" field is not in valid format!'

        // validate null
        if (!email.to) fields.push('to')
        else {
            if (!email.to.name) {
                throw new ValidationException(INVALID_TO, 'The name attribute is required.')
            }
            if (!email.to.email) {
                throw new ValidationException(INVALID_TO, 'The email attribute is required.')
            }
            EmailValidator.validate(email.to.email)
        }
        if (!email.action_url) fields.push('action_url')

        if (fields.length > 0) {
            throw new ValidationException('Required fields were not provided...',
                'Email validation: '.concat(fields.join(', ')).concat(' is required!'))
        }
    }
}
