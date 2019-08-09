import { ValidationException } from '../exception/validation.exception'

export class EmailValidator {
    public static validate(email: string | undefined): void | ValidationException {
        if (!email || !(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/).test(email)) {
            throw new ValidationException(`Email "${email}" does not have a valid format!`)
        }
    }
}
