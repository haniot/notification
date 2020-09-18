import { ValidationException } from '../exception/validation.exception'
import { Strings } from '../../../utils/strings'

export class EnumValuesValidator {
    public static validate(item: string, key: string, enumerate: object) {
        const values: Array<string> = Object.values(enumerate)
        if (!(values.includes(item))) {
            throw new ValidationException(
                `${Strings.ERROR_MESSAGE.NOT_MAPPED.replace('{0}', key)} ${item}`,
                `${Strings.ERROR_MESSAGE.NOT_MAPPED_DESC} ${values.join(', ')}.`
            )
        }
    }
}
