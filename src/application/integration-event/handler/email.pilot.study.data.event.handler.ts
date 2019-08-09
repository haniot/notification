import { inject } from 'inversify'
import { Identifier } from '../../../di/identifiers'
import { IIntegrationEventHandler } from './integration.event.handler.interface'
import { ILogger } from '../../../utils/custom.logger'
import { EmailEvent } from '../event/email.event'
import { IEmailRepository } from '../../port/email.repository.interface'
import { EmailPilotStudyDataValidator } from '../../domain/validator/email.pilot.study.data.validator'

export class EmailPilotStudyDataEventHandler implements IIntegrationEventHandler<EmailEvent> {
    /**
     * Creates an instance of EmailPilotStudyDataEventHandler.
     *
     * @param _emailRepository
     * @param _logger
     */
    constructor(
        @inject(Identifier.EMAIL_REPOSITORY) public readonly _emailRepository: IEmailRepository,
        @inject(Identifier.LOGGER) private readonly _logger: ILogger
    ) {
    }

    public async handle(event: EmailEvent): Promise<void> {
        try {
            const email: any = event.email

            // 1. Validate object based on create action.
            EmailPilotStudyDataValidator.validate(email)

            // 2 Configure email and send
            const lang: string = email.lang ? email.lang : 'pt-BR'
            await this._emailRepository.sendTemplateAndAttachment(
                'pilot-study-data',
                { name: email.to.name, email: email.to.email },
                email.attachments.map(item => {
                    item.contentType = item.content_type
                    delete item.content_type
                    return item
                }),
                {
                    name: email.to.name,
                    pilot_study: email.pilot_study,
                    request_date: new Date(email.request_date).toString(),
                    action_url: email.action_url
                },
                lang
            )
            // 3. If got here, it's because the action was successful.
            this._logger.info(`Action for event ${event.event_name} successfully performed!`)
        } catch (err) {
            this._logger.warn(`An error occurred while attempting `
                .concat(`perform the operation with the ${event.event_name} name event. ${err.message}`)
                .concat(err.description ? ' ' + err.description : ''))
        }
    }
}
