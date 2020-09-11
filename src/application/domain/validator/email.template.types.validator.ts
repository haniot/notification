import { ValidationException } from '../exception/validation.exception'
import { EmailTemplateTypes } from '../model/email.template'
import { Strings } from '../../../utils/strings'

export class EmailTemplateTypesValidator {
    public static validate(type: string): void | ValidationException {
        const types: Array<string> = Object.values(EmailTemplateTypes)

        if (!(types.includes(type))) {
            throw new ValidationException(
                `${Strings.ERROR_MESSAGE.NOT_MAPPED.replace('{0}', 'type')} ${type}`,
                `${Strings.ERROR_MESSAGE.NOT_MAPPED_DESC} ${types.join(', ')}.`
                )
        }
    }
}
