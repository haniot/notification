import { PushTypes, Push } from '../model/push'
import { ValidationException } from '../exception/validation.exception'
import { ObjectIdValidator } from './object.id.validator'
import { EnumValuesValidator } from './enum.values.validator'
import { ChoiceTypes } from '../utils/choice.types'
import { Strings } from '../../../utils/strings'

export class PushValidator {
    public static validate(item: Push): void | ValidationException {
        let fields: Array<string> = []

        const getMessageMissedFields = (key: string, obj: any) => {
            const missed_fields: Array<string> = []
            if (!obj.title) missed_fields.push(`${key}.title`)
            if (!obj.text) missed_fields.push(`${key}.text`)
            return missed_fields
        }

        if (!item.type) fields.push('type')
        else EnumValuesValidator.validate(item.type, 'type', PushTypes)
        if (!item.keep_it) fields.push('keep_it')
        else EnumValuesValidator.validate(item.keep_it, 'keep_it', ChoiceTypes)
        if (!item.to) fields.push('to')
        else {
            if (!item.to.length) {
                throw new ValidationException(
                    Strings.ERROR_MESSAGE.VALIDATE.AT_LEAST_ONE_RECIPIENT,
                    Strings.ERROR_MESSAGE.VALIDATE.AT_LEAST_ONE_RECIPIENT_DESC
                )
            }
            if (item.type === PushTypes.DIRECT) item.to.map(user_id => ObjectIdValidator.validate(user_id))
        }
        if (!item.message) fields.push('message')
        else {
            if (!item.message.type) fields.push('message.type')
            if (!item.message.pt) fields.push('message.pt')
            else fields = fields.concat(getMessageMissedFields('message.pt', item.message.pt))
            if (!item.message.eng) fields.push('message.eng')
            else fields = fields.concat(getMessageMissedFields('message.eng', item.message.eng))
        }
        if (!item.user_id) fields.push('user_id')
        else ObjectIdValidator.validate(item.user_id, Strings.USER.PARAM_ID_NOT_VALID_FORMAT)

        if (fields.length > 0) {
            throw new ValidationException(
                Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS,
                Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS_DESC.replace('{0}', fields.join(', '))
            )
        }
    }
}
