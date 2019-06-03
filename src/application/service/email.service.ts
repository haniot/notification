import { inject, injectable } from 'inversify'
import { Identifier } from '../../di/identifiers'
import { IEmailService } from '../port/email.service.interface'
import { Email } from '../domain/model/email'
import { IEmailRepository } from '../port/email.repository.interface'
import { IQuery } from '../port/query.interface'
import { EmailSendValidator } from '../domain/validator/email.send.validator'
import { ObjectIdValidator } from '../domain/validator/object.id.validator'
import { Strings } from '../../utils/strings'

/**
 * Implementing email Service.
 *
 * @implements {IEmailService}
 */
@injectable()
export class EmailService implements IEmailService {

    constructor(@inject(Identifier.EMAIL_REPOSITORY) private readonly _emailRepository: IEmailRepository) {
    }

    public async send(email: Email): Promise<Email> {
        EmailSendValidator.validate(email)
        return this._emailRepository.send(email)
    }

    public async getAllFromUser(userId: string, query: IQuery): Promise<Array<Email>> {
        ObjectIdValidator.validate(userId, Strings.USER.PARAM_ID_NOT_VALID_FORMAT)

        query.addFilter({ user_id: userId })
        return this._emailRepository.find(query)
    }

    public async getByIdAndFromUser(emailId: string, userId: string, query: IQuery): Promise<Email> {
        ObjectIdValidator.validate(emailId, Strings.ERROR_MESSAGE.UUID_NOT_VALID_FORMAT)
        ObjectIdValidator.validate(userId, Strings.USER.PARAM_ID_NOT_VALID_FORMAT)

        query.addFilter({ _id: emailId, user_id: userId })
        return this._emailRepository.findOne(query)
    }

    public async getAll(query: IQuery): Promise<Array<Email>> {
        return this._emailRepository.find(query)
    }

    public async add(item: Email): Promise<Email> {
        throw new Error('Unsupported feature!')
    }

    public async getById(id: string, query: IQuery): Promise<Email> {
        throw new Error('Unsupported feature!')
    }

    public async remove(id: string): Promise<boolean> {
        return this._emailRepository.delete(id)
    }

    public async update(item: Email): Promise<Email> {
        return this._emailRepository.update(item)
    }
}
