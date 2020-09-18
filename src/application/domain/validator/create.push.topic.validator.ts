import { PushTopic } from '../model/push.topic'
import { ValidationException } from '../exception/validation.exception'

export class CreatePushTopicValidator {
    public static validate(item: PushTopic) {
        const fields: Array<string> = []

        const validateName = (name: string) => /^[.a-zA-Z\d]{4,30}$/.test(name)

        if (!item.name) fields.push('name')
        else {
            if (!(validateName(item.name))) throw new ValidationException('Name must be contain only letters, numbers and dots.')
        }
        if (!item.subscribers?.length) fields.push('subscribers')

        if (fields.length > 0) {
            throw new ValidationException(
                'Required fields were not provided...',
                `Push Topic Validation: ${fields.join(', ')} required!`
            )
        }
    }
}
