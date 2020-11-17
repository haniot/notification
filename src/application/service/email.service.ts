import { inject, injectable } from 'inversify'
import { Identifier } from '../../di/identifiers'
import { IEmailService } from '../port/email.service.interface'
import { Email } from '../domain/model/email'
import { IEmailRepository } from '../port/email.repository.interface'
import { IQuery } from '../port/query.interface'
import { EmailSendValidator } from '../domain/validator/email.send.validator'
import { ObjectIdValidator } from '../domain/validator/object.id.validator'
import { Strings } from '../../utils/strings'
import { EmailTemplate, EmailTemplateResources, EmailTemplateTypes } from '../domain/model/email.template'
import { EmailTemplateValidator } from '../domain/validator/email.template.validator'
import { EnumValuesValidator } from '../domain/validator/enum.values.validator'

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
        try {
            EmailSendValidator.validate(email)

            return this._emailRepository.send(email)
        } catch (e) {
            return Promise.reject(e)
        }
    }

    public async getAllFromUser(userId: string, query: IQuery): Promise<Array<Email>> {
        try {
            ObjectIdValidator.validate(userId, Strings.USER.PARAM_ID_NOT_VALID_FORMAT)

            query.addFilter({ user_id: userId })
            return this._emailRepository.find(query)
        } catch (e) {
            return Promise.reject(e)
        }
    }

    public async getByIdAndFromUser(emailId: string, userId: string, query: IQuery): Promise<Email> {
        try {
            ObjectIdValidator.validate(emailId, Strings.ERROR_MESSAGE.VALIDATE.UUID_NOT_VALID_FORMAT)
            ObjectIdValidator.validate(userId, Strings.USER.PARAM_ID_NOT_VALID_FORMAT)

            query.addFilter({ _id: emailId, user_id: userId })
            return this._emailRepository.findOne(query)
        } catch (e) {
            return Promise.reject(e)
        }
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

    public count(query: IQuery): Promise<number> {
        return this._emailRepository.count(query)
    }

    public async findTemplateByTypeAndResource(type: string, resource: string): Promise<Buffer> {
        try {
            EnumValuesValidator.validate(type, 'type', EmailTemplateTypes)
            EnumValuesValidator.validate(resource, 'resource', EmailTemplateResources)
            const result: Buffer = await this._emailRepository.findTemplateByTypeAndResource(type, resource)
            return Promise.resolve(result)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async updateTemplate(item: EmailTemplate): Promise<EmailTemplate> {
        try {
            EmailTemplateValidator.validate(item)
            const result: EmailTemplate = await this._emailRepository.updateTemplate(item)
            return Promise.resolve(result)
        } catch (err) {
            return Promise.reject(err)
        }
    }
}
