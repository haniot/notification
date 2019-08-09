import { ValidationException } from '../exception/validation.exception'
import { EmailValidator } from './email.validator'

export class EmailToValidator {
    public static validate(email: any): void | ValidationException {
        const INVALID_TO: string = 'The "to" field is not in valid format!'

        if (!email.name) {
            throw new ValidationException(INVALID_TO, 'The name attribute is required.')
        }
        if (!email.email) {
            throw new ValidationException(INVALID_TO, 'The email attribute is required.')
        }
        EmailValidator.validate(email.email)
    }
}
