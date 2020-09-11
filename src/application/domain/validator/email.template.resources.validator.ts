import { ValidationException } from '../exception/validation.exception'
import { EmailTemplateResources } from '../model/email.template'
import { Strings } from '../../../utils/strings'

export class EmailTemplateResourcesValidator {
    public static validate(resource: string): void | ValidationException {
        const resources: Array<string> = Object.values(EmailTemplateResources)

        if (!(resources.includes(resource))) {
            throw new ValidationException(
                `${Strings.ERROR_MESSAGE.NOT_MAPPED.replace('{0}', 'resource')} ${resource}`,
                `${Strings.ERROR_MESSAGE.NOT_MAPPED_DESC} ${resources.join(', ')}.`
                )
        }
    }
}
