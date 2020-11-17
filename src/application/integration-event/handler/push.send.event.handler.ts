import { inject } from 'inversify'
import { Identifier } from '../../../di/identifiers'
import { IIntegrationEventHandler } from './integration.event.handler.interface'
import { ILogger } from '../../../utils/custom.logger'
import { IPushService } from '../../port/push.service.interface'
import { PushSendEvent } from '../event/push.send.event'
import { Push } from '../../domain/model/push'

export class PushSendEventHandler implements IIntegrationEventHandler<PushSendEvent> {
    /**
     * Creates an instance of PushSendEventHandler.
     *
     * @param _pushService
     * @param _logger
     */
    constructor(
        @inject(Identifier.PUSH_SERVICE) public readonly _pushService: IPushService,
        @inject(Identifier.LOGGER) private readonly _logger: ILogger
    ) {
    }

    public async handle(event: PushSendEvent): Promise<void> {
        try {
            const push: Push = new Push().fromJSON(event.push)

            // 1. Validate and send push
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
