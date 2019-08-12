import { inject } from 'inversify'
import { Identifier } from '../../../di/identifiers'
import { IIntegrationEventHandler } from './integration.event.handler.interface'
import { ILogger } from '../../../utils/custom.logger'
import { EmailEvent } from '../event/email.event'
import { IEmailRepository } from '../../port/email.repository.interface'
import { User } from '../../domain/model/User'
import { UserValidator } from '../event/user.validator'
import { UserDeleteEvent } from '../event/user.delete.event'

export class UserDeleteEventHandler implements IIntegrationEventHandler<EmailEvent> {
    /**
     * Creates an instance of EmailWelcomeEventHandler.
     *
     * @param _emailRepository
     * @param _logger
     */
    constructor(
        @inject(Identifier.EMAIL_REPOSITORY) public readonly _emailRepository: IEmailRepository,
        @inject(Identifier.LOGGER) private readonly _logger: ILogger
    ) {
    }

    public async handle(event: UserDeleteEvent): Promise<void> {
        try {
            const user: User = new User().fromJSON(event.user)
            UserValidator.validate(user)
            await this._emailRepository.removeAllFromUser(user.id!)
            this._logger.info(`Action for event ${event.event_name} successfully performed!`)
        } catch (err) {
            this._logger.warn(`An error occurred while attempting `
                .concat(`perform the operation with the ${event.event_name} name event. ${err.message}`)
                .concat(err.description ? ' ' + err.description : ''))
        }
    }
}
