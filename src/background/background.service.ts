import { Config } from '../utils/config'
import { inject, injectable } from 'inversify'
import { Identifier } from '../di/identifiers'
import { ILogger } from '../utils/custom.logger'
import { IConnectionDB } from '../infrastructure/port/connection.db.interface'
import { IBackgroundTask } from '../application/port/background.task.interface'
import { IEventBus } from '../infrastructure/port/event.bus.interface'
import { IConnectionFirebase } from '../infrastructure/port/connection.firebase.interface'

@injectable()
export class BackgroundService {

    constructor(
        @inject(Identifier.RABBITMQ_EVENT_BUS) private readonly _eventBus: IEventBus,
        @inject(Identifier.MONGODB_CONNECTION) private readonly _mongodb: IConnectionDB,
        @inject(Identifier.FIREBASE_CONNECTION) private readonly _firebase: IConnectionFirebase,
        @inject(Identifier.SUBSCRIBE_EVENT_BUS_TASK) private readonly _subscribeTask: IBackgroundTask,
        @inject(Identifier.LOGGER) private readonly _logger: ILogger
    ) {
    }

    public async startServices(): Promise<void> {
        try {
            // Trying to connect to mongodb.
            // Go ahead only when the run is resolved.
            // Since the application depends on the database connection to work.
            const dbConfigs = Config.getMongoConfig()
            await this._mongodb.tryConnect(dbConfigs.uri, dbConfigs.options)

            // Initializes the Firebase SDK.
            await this._firebase.init()
                .then(() => this._logger.info('Connection to Google Firebase successful!'))
                .catch(err => this._logger.error(`Could not initialize the Firebase SDK: ${err.message}`))

            // Opens RabbitMQ connection to perform tasks
            this._startTasks()
        } catch (err) {
            return Promise.reject(new Error(`Error initializing services in background! ${err.message}`))
        }
    }

    public async stopServices(): Promise<void> {
        try {
            await this._mongodb.dispose()

            await this._subscribeTask.stop()
        } catch (err) {
            return Promise.reject(new Error(`Error stopping background services! ${err.message}`))
        }
    }

    /**
     * Open RabbitMQ connection and perform tasks
     */
    private _startTasks(): void {
        const rabbitConfigs = Config.getRabbitConfig()

        this._eventBus
            .connectionSub
            .open(rabbitConfigs.uri, rabbitConfigs.options)
            .then(() => {
                this._logger.info('Connection with subscribe event opened successful!')
                this._subscribeTask.run()
            })
            .catch(err => {
                this._logger.error(`Error trying to get connection to Event Bus for event subscribing. ${err.message}`)
            })
    }
}
