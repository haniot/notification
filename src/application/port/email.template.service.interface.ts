import { EmailTemplate } from '../domain/model/email.template'

export interface IEmailTemplateService {
    update(item: EmailTemplate): Promise<EmailTemplate>

    findByTypeAndResource(type: string, resource: string): Promise<Buffer>
}
