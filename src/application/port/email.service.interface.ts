import { Email } from '../domain/model/email'
import { IService } from './service.interface'
import { IQuery } from './query.interface'

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
}
