import { EmailTemplate } from '../domain/model/email.template'

export interface IEmailTemplateRepository {
    findByTypeAndResource(type: string, resource: string): Promise<Buffer>

    update(item: EmailTemplate): Promise<EmailTemplate>
}
