import { Email } from '../domain/model/email'
import { IService } from './service.interface'
import { IQuery } from './query.interface'
import { EmailTemplate } from '../domain/model/email.template'

/**
 * Interface of the email service.
 * Must be implemented by the email service at the application layer.
 *
 * @see {@link EmailService} for further information.
 * @extends {IService<Email>}
 */
export interface IEmailService extends IService<Email> {
    /**
     * Send email.
     *
     * @param email
     * @return {Promise<Email>}
     * @throws {ValidationException | RepositoryException}
     */
    send(email: Email): Promise<Email>

    /**
     * List the emails of a user.
     *
     * @param userId User ID.
     * @param query Defines object to be used for queries.
     * @return {Promise<Array<Email>>}
     * @throws {RepositoryException}
     */
    getAllFromUser(userId: string, query: IQuery): Promise<Array<Email>>

    /**
     * Recover user email data.
     *
     * @param emailId Email ID.
     * @param userId User ID.
     * @param query Defines object to be used for queries.
     * @return {Promise<Email>}
     * @throws {RepositoryException}
     */
    getByIdAndFromUser(emailId: string, userId: string, query: IQuery): Promise<Email>

    /**
     * Find email template by type and resource.
     *
     * @param type Email template type.
     * @param resource Email template resource.
     * @return {Promise<Buffer>}
     * @throws {ValidationException | RepositoryException}
     */
    findTemplateByTypeAndResource(type: string, resource: string): Promise<Buffer>

    /**
     * Updates email template.
     *
     * @param emailTemplate Containing the data to be updated.
     * @return {Promise<EmailTemplate>}
     * @throws {ValidationException | RepositoryException}
     */
    updateTemplate(emailTemplate: EmailTemplate): Promise<EmailTemplate>
}
