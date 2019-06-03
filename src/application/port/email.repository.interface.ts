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
}
