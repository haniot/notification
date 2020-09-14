import { ValidationException } from '../exception/validation.exception'
import { PushTokenClientTypes } from '../model/push.token'
import { Strings } from '../../../utils/strings'

export class PushTokenClientTypesValidator {
    public static validate(item: string): void | ValidationException {
        const values: Array<string> = Object.values(PushTokenClientTypes)
        if (!(values.includes(item))) {
            throw new ValidationException(
                `${Strings.ERROR_MESSAGE.NOT_MAPPED.replace('{0}', 'client_type')} ${item}`,
                `${Strings.ERROR_MESSAGE.NOT_MAPPED_DESC} ${values.join(', ')}.`
            )
        }
    }
}
