import { Email } from '../domain/model/email'
import { IRepository } from './repository.interface'
import { EmailTemplate } from '../domain/model/email.template'

/**
 * Interface of the email repository.
 * Must be implemented by the email repository at the infrastructure layer.
 *
 * @see {@link PhysicalActivityRepository} for further information.
 * @extends {IRepository<Email>}
 */
export interface IEmailRepository extends IRepository<Email> {
    /**
     * Send mail and save to local database.
     *
     * @param email
     * @return {Promise<Email | undefined>}
     * @throws {ValidationException | RepositoryException}
     */
    send(email: Email): Promise<Email | undefined>

    /**
     * Send email using a predefined template.
     *
     * @param name
     * @param to
     * @param data
     * @param lang
     * @return {Promise<void>}
     * @throws {ValidationException | RepositoryException}
     */
    sendTemplate(name: string, to: any, data: any, lang?: string): Promise<void>

    /**
     * Send email and attachments using a predefined template.
     *
     * @param name
     * @param to
     * @param attachments
     * @param data
     * @param lang
     */
    sendTemplateAndAttachment(name: string, to: any, attachments: Array<any>,
                              data: any, lang?: string): Promise<void>

    /**
     * Remove all emails sent by the user
     *
     * @param userId
     * @return {Promise<void>}
     * @throws {ValidationException | RepositoryException}
     */
    removeAllFromUser(userId: string): Promise<boolean>

    /**
     * Find email template by type and resource.
     *
     * @param type Email template type.
     * @param resource Email template resource.
     * @return {Promise<Buffer>}
     * @throws {Exception}
     */
    findTemplateByTypeAndResource(type: string, resource: string): Promise<Buffer>

    /**
     * Updates email template.
     *
     * @param emailTemplate Containing the data to be updated.
     * @return {Promise<EmailTemplate>}
     * @throws {Exception}
     */
    updateTemplate(emailTemplate: EmailTemplate): Promise<EmailTemplate>
}
