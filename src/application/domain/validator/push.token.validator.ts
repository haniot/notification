import { PushToken, PushTokenClientTypes } from '../model/push.token'
import { ValidationException } from '../exception/validation.exception'
import { ObjectIdValidator } from './object.id.validator'
import { EnumValuesValidator } from './enum.values.validator'
import { Strings } from '../../../utils/strings'

export class PushTokenValidator {
    public static validate(item: PushToken): void | ValidationException {
        const fields: Array<string> = []

        if (!item.user_id) fields.push('user_id')
        else ObjectIdValidator.validate(item.user_id, Strings.USER.PARAM_ID_NOT_VALID_FORMAT)
        if (!item.client_type) fields.push('client_type')
        else EnumValuesValidator.validate(item.client_type, 'client_type', PushTokenClientTypes)
        if (!item.token) fields.push('token')

        if (fields.length > 0) {
            throw new ValidationException(
                Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS,
                Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS_DESC.replace('{0}', fields.join(', '))
            )
        }
    }
}
