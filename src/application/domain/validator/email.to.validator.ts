import { ValidationException } from '../exception/validation.exception'
import { EmailValidator } from './email.validator'
import { Strings } from '../../../utils/strings'

export class EmailToValidator {
    public static validate(email: any): void | ValidationException {
        if (!email.name) {
            throw new ValidationException(
                Strings.ERROR_MESSAGE.VALIDATE.INVALID_TO,
                Strings.ERROR_MESSAGE.VALIDATE.INVALID_TO_DESC.replace('{0}', 'name')
            )
        }
        if (!email.email) {
            throw new ValidationException(
                Strings.ERROR_MESSAGE.VALIDATE.INVALID_TO,
                Strings.ERROR_MESSAGE.VALIDATE.INVALID_TO_DESC.replace('{0}', 'email')
            )
        }
        EmailValidator.validate(email.email)
    }
}
