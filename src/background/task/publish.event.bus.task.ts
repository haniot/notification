import { inject, injectable } from 'inversify'
import { Identifier } from '../../di/identifiers'
import { IEventBus } from '../../infrastructure/port/event.bus.interface'
import { ILogger } from '../../utils/custom.logger'
import { Query } from '../../infrastructure/repository/query/query'
import { IIntegrationEventRepository } from '../../application/port/integration.event.repository.interface'
import { IntegrationEvent } from '../../application/integration-event/event/integration.event'
import { IBackgroundTask } from '../../application/port/background.task.interface'

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
        this.publishSavedEvents()
    }

    public async stop(): Promise<void> {
        try {
            await this._eventBus.dispose()
            if (this.handlerPub) clearInterval(this.handlerPub)
        } catch (err) {
            return Promise.reject(new Error(`Error stopping EventBusTask! ${err.message}`))
        }
    }

    /**
     * It publishes events, that for some reason could not
     * be sent and were saved for later submission.
     */
    private publishSavedEvents(): void {
        this._eventBus.connectionPub
            .open(0, 1500)
            .then(async () => {
                this._logger.info('Connection to publish established successfully!')
                await this.internalPublishSavedEvents(this.publishEvent, this._eventBus,
                    this._integrationEventRepository, this._logger)

                this.handlerPub = setInterval(this.internalPublishSavedEvents, 300000, // 5min
                    this.publishEvent,
                    this._eventBus,
                    this._integrationEventRepository,
                    this._logger)
            })
            .catch(err => {
                this._logger.error(`Error trying to get connection to Event Bus for event publishing. ${err.message}`)
            })
    }

    private async internalPublishSavedEvents(
        publishEvent: any, eventBus: IEventBus, integrationEventRepository: IIntegrationEventRepository,
        logger: ILogger): Promise<void> {
        if (!eventBus.connectionPub.isOpen) return

        try {
            const result: Array<any> = await integrationEventRepository.find(new Query())
            result.forEach((item: IntegrationEvent<any>) => {
                const event: any = item.toJSON()
                publishEvent(event, eventBus)
                    .then(pubResult => {
                        if (pubResult) {
                            logger.info(`Event with name ${event.event_name}, which was saved, `
                                .concat(`was successfully published to the event bus.`))
                            integrationEventRepository.delete(event.id)
                                .catch(err => {
                                    logger.error(`Error trying to remove saved event: ${err.message}`)
                                })
                        }
                    })
                    .catch(() => {
                        logger.error(`Error while trying to publish event saved with ID: ${event.id}`)
                    })
            })
        } catch (err) {
            logger.error(`Error retrieving saved events: ${err.message}`)
        }
    }

    private publishEvent(event: any, eventBus: IEventBus): Promise<boolean> {
        return Promise.resolve(false)
    }
}
