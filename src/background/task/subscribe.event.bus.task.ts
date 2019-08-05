import { inject, injectable } from 'inversify'
import { Identifier } from '../../di/identifiers'
import { IEventBus } from '../../infrastructure/port/event.bus.interface'
import { ILogger } from '../../utils/custom.logger'
import { IBackgroundTask } from '../../application/port/background.task.interface'
import { EmailEvent } from '../../application/integration-event/event/email.event'
import { EmailSendEventHandler } from '../../application/integration-event/handler/email.send.event.handler'
import { DIContainer } from '../../di/di'
import { EmailWelcomeEventHandler } from '../../application/integration-event/handler/email.welcome.event.handler'

@injectable()
export class SubscribeEventBusTask implements IBackgroundTask {
    constructor(
        @inject(Identifier.RABBITMQ_EVENT_BUS) private readonly _eventBus: IEventBus,
        @inject(Identifier.LOGGER) private readonly _logger: ILogger
    ) {
    }

    public run(): void {
        // Before performing the subscribe is trying to connect to the bus.
        // If there is no connection, infinite attempts will be made until
        // the connection is established successfully. Once you have the
        // connection, event registration is performed.
        this._eventBus
            .connectionSub
            .open(0, 1000)
            .then(() => this.initializeSubscribe())
            .catch(err => {
                this._logger.error(`Could not open connection to subscribe to message bus, ${err.message}`)
            })
    }

    public async stop(): Promise<void> {
        try {
            await this._eventBus.dispose()
        } catch (err) {
            return Promise.reject(new Error(`Error stopping SubscribeEventBusTask! ${err.message}`))
        }
    }

    /**
     * Subscribe for all events.
     */
    private async initializeSubscribe(): Promise<void> {
        try {
            await this._eventBus.subscribe(
                new EmailEvent('EmailSendEvent'),
                new EmailSendEventHandler(DIContainer.get(Identifier.EMAIL_REPOSITORY), this._logger),
                'emails.send'
            )
            this._logger.info('Subscribe in EmailSendEvent successful!')

            await this._eventBus
                .subscribe(
                    new EmailEvent('EmailWelcomeEvent'),
                    new EmailWelcomeEventHandler(DIContainer.get(Identifier.EMAIL_REPOSITORY), this._logger),
                    'emails.welcome'
                )
            this._logger.info('Subscribe in EmailWelcomeEvent successful!')

        } catch (err) {
            this._logger.error(`An error occurred while subscribing to events. ${err.message}`)
        }
    }
}
