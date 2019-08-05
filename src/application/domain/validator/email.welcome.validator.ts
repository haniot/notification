import { ValidationException } from '../exception/validation.exception'
import { EmailValidator } from './email.validator'

export class EmailWelcomeValidator {
    public static validate(email: any): void | ValidationException {
        const fields: Array<string> = []

        // validate null
        if (!email.to) fields.push('to')
        else {
            if (!email.to.name) {
                throw new ValidationException('Name is required!')
            }
            if (!email.to.email) {
                throw new ValidationException('Email address is required!')
            }
            EmailValidator.validate(email.to.email)
        }

        if (fields.length > 0) {
            throw new ValidationException('Required fields were not provided...',
                'Email validation: '.concat(fields.join(', ')).concat(' is required!'))
        }
    }
}
