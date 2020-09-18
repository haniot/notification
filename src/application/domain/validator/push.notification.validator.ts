import { NotificationTypes, PushNotification } from '../model/push.notification'
import { ValidationException } from '../exception/validation.exception'
import { ObjectIdValidator } from './object.id.validator'
import { EnumValuesValidator } from './enum.values.validator'
import { ChoiceTypes } from '../utils/choice.types'

export class PushNotificationValidator {
    public static validate(item: PushNotification): void | ValidationException {
        let fields: Array<string> = []

        const getMessageMissedFields = (key: string, obj: any) => {
            const missed_fields: Array<string> = []
            if (!obj.title) missed_fields.push(`${key}.title`)
            if (!obj.text) missed_fields.push(`${key}.text`)
            return missed_fields
        }

        if (!item.type) fields.push('type')
        else EnumValuesValidator.validate(item.type, 'type', NotificationTypes)
        if (!item.keep_it) fields.push('keep_it')
        else EnumValuesValidator.validate(item.keep_it, 'keep_it', ChoiceTypes)
        if (!item.to) fields.push('to')
        else {
            if (item.type === NotificationTypes.DIRECT) item.to.map(user_id => ObjectIdValidator.validate(user_id))
        }
        if (!item.message) fields.push('message')
        else {
            if (!item.message.type) fields.push('message.type')
            if (!item.message.pt) fields.push('message.pt')
            else fields = fields.concat(getMessageMissedFields('message.pt', item.message.pt))
            if (!item.message.eng) fields.push('message.eng')
            else fields = fields.concat(getMessageMissedFields('message.eng', item.message.eng))
        }

        if (fields.length > 0) {
            throw new ValidationException(
                'Required fields were not provided...',
                `Push Notification validation: ${fields.join(', ')} required.`)
        }
    }
}
