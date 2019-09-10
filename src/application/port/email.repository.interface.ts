import { Email } from '../domain/model/email'
import { IRepository } from './repository.interface'

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
     * @return {Promise<Email>}
     * @throws {ValidationException | RepositoryException}
     */
    send(email: Email): Promise<Email>

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
}