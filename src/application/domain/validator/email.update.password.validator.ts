import { ValidationException } from '../exception/validation.exception'
import { EmailToValidator } from './email.to.validator'
import { Strings } from '../../../utils/strings'

export class EmailUpdatePasswordValidator {
    public static validate(email: any): void | ValidationException {
        const fields: Array<string> = []

        // validate null
        if (!email.to) fields.push('to')
        else EmailToValidator.validate(email.to)

        if (fields.length > 0) {
            throw new ValidationException(
                Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS,
                Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS_DESC.replace('{0}', fields.join(', '))
            )
        }
    }
}
