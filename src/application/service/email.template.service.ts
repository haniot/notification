import { inject, injectable } from 'inversify'
import { Identifier } from '../../di/identifiers'
import { IEmailTemplateService } from '../port/email.template.service.interface'
import { IEmailTemplateRepository } from '../port/email.template.repository.interface'
import { EmailTemplate } from '../domain/model/email.template'
import { EmailTemplateTypesValidator } from '../domain/validator/email.template.types.validator'
import { EmailTemplateResourcesValidator } from '../domain/validator/email.template.resources.validator'
import { EmailTemplateValidator } from '../domain/validator/email.template.validator'

@injectable()
export class EmailTemplateService implements IEmailTemplateService {

    constructor(@inject(Identifier.EMAIL_TEMPLATE_REPOSITORY) private readonly _emailTemplateRepo: IEmailTemplateRepository) {
    }

    public async findByTypeAndResource(type: string, resource: string): Promise<Buffer> {
        try {
            EmailTemplateTypesValidator.validate(type)
            EmailTemplateResourcesValidator.validate(resource)
            const result: Buffer = await this._emailTemplateRepo.findByTypeAndResource(type, resource)
            return Promise.resolve(result)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async update(item: EmailTemplate): Promise<EmailTemplate> {
        try {
            EmailTemplateValidator.validate(item)
            const result: EmailTemplate = await this._emailTemplateRepo.update(item)
            return Promise.resolve(result)
        } catch (err) {
            return Promise.reject(err)
        }
    }
}
