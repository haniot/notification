import { PushToken } from '../model/push.token'
import { ValidationException } from '../exception/validation.exception'
import { ObjectIdValidator } from './object.id.validator'
import { PushTokenClientTypesValidator } from './push.token.client.types.validator'

export class PushTokenValidator {
    public static validate(item: PushToken): void | ValidationException {
        const fields: Array<string> = []

        if (!item.user_id) fields.push('user_id')
        else ObjectIdValidator.validate(item.user_id)
        if (!item.client_type) fields.push('client_type')
        else PushTokenClientTypesValidator.validate(item.client_type)
        if (!item.token) fields.push('token')

        if (fields.length > 0) {
            throw new ValidationException(
                'Required fields were not provided...',
                `Push Token Validation: ${fields.join(', ')} required!`
            )
        }
    }
}
