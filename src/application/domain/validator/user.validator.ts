import { User } from '../model/user'
import { ValidationException } from '../exception/validation.exception'
import { ObjectIdValidator } from './object.id.validator'
import { Strings } from '../../../utils/strings'

export class UserValidator {
    public static validate(item: User): void | ValidationException {
        const fields: Array<string> = []

        if (!item.id) fields.push('id')
        else ObjectIdValidator.validate(item.id)
        if (!item.type) fields.push('type')

        if (fields.length > 0) {
            throw new ValidationException(
                Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS,
                Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS_DESC.replace('{0}', fields.join(', '))
            )
        }
    }
}
