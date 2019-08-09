import { inject, injectable } from 'inversify'
import { Identifier } from '../../di/identifiers'
import { IEventBus } from '../../infrastructure/port/event.bus.interface'
import { ILogger } from '../../utils/custom.logger'
import { IBackgroundTask } from '../../application/port/background.task.interface'
import { Query } from '../../infrastructure/repository/query/query'
import { IIntegrationEventRepository } from '../../application/port/integration.event.repository.interface'
import { IntegrationEvent } from '../../application/integration-event/event/integration.event'
import { EmailEvent } from '../../application/integration-event/event/email.event'
import { Email } from '../../application/domain/model/email'

@injectable()
export class PublishEventBusTask implements IBackgroundTask {
    private handlerPub: any

    constructor(
        @inject(Identifier.RABBITMQ_EVENT_BUS) private readonly _eventBus: IEventBus,
        @inject(Identifier.INTEGRATION_EVENT_REPOSITORY)
        private readonly _integrationEventRepository: IIntegrationEventRepository,
        @inject(Identifier.LOGGER) private readonly _logger: ILogger
    ) {
    }

    public run(): void {
        // It publishes events, that for some reason could not
        // e sent and were saved for later submission.
        this._eventBus
            .connectionPub
            .open(0, 2000)
            .then((conn) => {
                this._logger.info('Connection to publish opened successfully!')
                conn.on('re_established_connection', () => this.internalPublishSavedEvents())
            })
            .catch(err => {
                this._logger.error(`Error trying to get connection to Event Bus for event publishing. ${err.message}`)
            })
    }

    public async stop(): Promise<void> {
        try {
            await this._eventBus.dispose()
            if (this.handlerPub) clearInterval(this.handlerPub)
        } catch (err) {
            return Promise.reject(new Error(`Error stopping PublishEventBusTask! ${err.message}`))
        }
    }

    private async internalPublishSavedEvents(): Promise<void> {
        if (!this._eventBus.connectionPub.isOpen) return

        try {
            const result: Array<any> = await this._integrationEventRepository.find(new Query())
            result.forEach((item: IntegrationEvent<any>) => {
                const event: any = item.toJSON()

                this._publishEvent(event)
                    .then(success => {
                        if (!success) {
                            this._logger.info(`Event with name ${event.event_name}, which was saved, `
                                .concat('was successfully published to the event bus.'))
                            this._integrationEventRepository
                                .delete(event.id)
                                .catch(err => {
                                    this._logger.error(`Error trying to remove saved event: ${err.message}`)
                                })
                        }
                    })
                    .catch(() => {
                        this._logger.error('An error occurred while attempting to post the'
                            .concat(`saved event by name ${event.event_name} and ID: ${event.id}`))
                    })
            })
        } catch (err) {
            this._logger.error(`Error retrieving saved events: ${err.message}`)
        }
    }

    private _publishEvent(event: any): Promise<boolean> {
        if (event.event_name === 'EmailSendEvent') {
            const physicalActivitySaveEvent: EmailEvent = new EmailEvent(
                event.event_name,
                event.timestamp,
                new Email().fromJSON(event.email)
            )
            return this._eventBus.publish(physicalActivitySaveEvent, event.__routing_key)
        }
        return Promise.resolve(false)
    }
}
