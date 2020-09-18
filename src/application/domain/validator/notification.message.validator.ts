import { ValidationException } from '../exception/validation.exception'
import { PushMessage } from '../model/push.message'

export class NotificationMessageValidator {
    public static validate(item: PushMessage): void | ValidationException {
        const fields: Array<string> = []

        if (!item.type) fields.push('type')
        if (!item.pt) fields.push('pt')
        if (!item.eng) fields.push('eng')

        if (fields.length > 0) {
            throw new ValidationException(
                'Required fields were not provided...',
                `Push Notification Message validation: ${fields.join(', ')} required.`)
        }
    }
}
