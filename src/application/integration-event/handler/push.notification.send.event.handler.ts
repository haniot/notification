import { inject } from 'inversify'
import { Identifier } from '../../../di/identifiers'
import { IIntegrationEventHandler } from './integration.event.handler.interface'
import { ILogger } from '../../../utils/custom.logger'
import { IPushNotificationService } from '../../port/push.notification.service.interface'
import { PushNotificationSendEvent } from '../event/push.notification.send.event'
import { PushNotification } from '../../domain/model/push.notification'

export class PushNotificationSendEventHandler implements IIntegrationEventHandler<PushNotificationSendEvent> {
    /**
     * Creates an instance of PushNotificationSendEventHandler.
     *
     * @param _pushService
     * @param _logger
     */
    constructor(
        @inject(Identifier.PUSH_NOTIFICATION_SERVICE) public readonly _pushService: IPushNotificationService,
        @inject(Identifier.LOGGER) private readonly _logger: ILogger
    ) {
    }

    public async handle(event: PushNotificationSendEvent): Promise<void> {
        try {
            const push: PushNotification = new PushNotification().fromJSON(event.push)

            // 1. Validate and send notification
            await this._pushService.send(push)

            // 3. If got here, it's because the action was successful.
            this._logger.info(`Action for event ${event.event_name} successfully performed!`)
        } catch (err) {
            this._logger.warn(`An error occurred while attempting `
                .concat(`perform the operation with the ${event.event_name} name event. ${err.message}`)
                .concat(err.description ? ' ' + err.description : ''))
        }
    }
}
