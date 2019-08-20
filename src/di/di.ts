import 'reflect-metadata'
import { Container } from 'inversify'
import { HomeController } from '../ui/controller/home.controller'
import { Identifier } from './identifiers'
import { EmailEntity } from '../infrastructure/entity/email.entity'
import { IEntityMapper } from '../infrastructure/port/entity.mapper.interface'
import { ConnectionFactoryMongoDB } from '../infrastructure/database/connection.factory.mongodb'
import { ConnectionMongoDB } from '../infrastructure/database/connection.mongodb'
import { IConnectionDB } from '../infrastructure/port/connection.db.interface'
import { IConnectionFactory } from '../infrastructure/port/connection.factory.interface'
import { BackgroundService } from '../background/background.service'
import { App } from '../app'
import { CustomLogger, ILogger } from '../utils/custom.logger'
import { EmailRepoModel } from '../infrastructure/database/schema/email.schema'
import { EmailEntityMapper } from '../infrastructure/entity/mapper/email.entity.mapper'
import { IEmailService } from '../application/port/email.service.interface'
import { EmailController } from '../ui/controller/email.controller'
import { EmailService } from '../application/service/email.service'
import { EmailRepository } from '../infrastructure/repository/email.repository'
import { Email } from '../application/domain/model/email'
import { IEmailRepository } from '../application/port/email.repository.interface'
import { ConnectionFactoryRabbitMQ } from '../infrastructure/eventbus/rabbitmq/connection.factory.rabbitmq'
import { IConnectionEventBus } from '../infrastructure/port/connection.event.bus.interface'
import { ConnectionRabbitMQ } from '../infrastructure/eventbus/rabbitmq/connection.rabbitmq'
import { IEventBus } from '../infrastructure/port/event.bus.interface'
import { EventBusRabbitMQ } from '../infrastructure/eventbus/rabbitmq/eventbus.rabbitmq'
import { IBackgroundTask } from '../application/port/background.task.interface'
import { SubscribeEventBusTask } from '../background/task/subscribe.event.bus.task'

class IoC {
    private readonly _container: Container

    /**
     * Creates an instance of DI.
     *
     * @private
     */
    constructor() {
        this._container = new Container()
        this.initDependencies()
    }

    get container(): Container {
        return this._container
    }

    /**
     * Initializes injectable containers.
     *
     * @private
     * @return void
     */
    private initDependencies(): void {
        this._container.bind(Identifier.APP).to(App).inSingletonScope()

        // Controllers
        this._container.bind<HomeController>(Identifier.HOME_CONTROLLER)
            .to(HomeController).inSingletonScope()
        this._container.bind<EmailController>(Identifier.EMAIL_CONTROLLER)
            .to(EmailController).inSingletonScope()

        // Services
        this._container.bind<IEmailService>(Identifier.EMAIL_SERVICE)
            .to(EmailService).inSingletonScope()

        // Repositories
        this._container.bind<IEmailRepository>(Identifier.EMAIL_REPOSITORY)
            .to(EmailRepository).inSingletonScope()

        // Mongoose Schema
        this._container.bind(Identifier.EMAIL_REPO_MODEL).toConstantValue(EmailRepoModel)

        // Mappers
        this._container
            .bind<IEntityMapper<Email, EmailEntity>>(Identifier.EMAIL_ENTITY_MAPPER)
            .to(EmailEntityMapper).inSingletonScope()

        // Background Services
        this._container
            .bind<IConnectionFactory>(Identifier.MONGODB_CONNECTION_FACTORY)
            .to(ConnectionFactoryMongoDB).inSingletonScope()
        this._container
            .bind<IConnectionDB>(Identifier.MONGODB_CONNECTION)
            .to(ConnectionMongoDB).inSingletonScope()
        this._container
            .bind<IConnectionFactory>(Identifier.RABBITMQ_CONNECTION_FACTORY)
            .to(ConnectionFactoryRabbitMQ).inSingletonScope()
        this._container
            .bind<IConnectionEventBus>(Identifier.RABBITMQ_CONNECTION)
            .to(ConnectionRabbitMQ)
        this._container
            .bind<IEventBus>(Identifier.RABBITMQ_EVENT_BUS)
            .to(EventBusRabbitMQ).inSingletonScope()
        this._container
            .bind(Identifier.BACKGROUND_SERVICE)
            .to(BackgroundService).inSingletonScope()
        this._container
            .bind<IBackgroundTask>(Identifier.SUBSCRIBE_EVENT_BUS_TASK)
            .to(SubscribeEventBusTask).inSingletonScope()

        // Log
        this._container.bind<ILogger>(Identifier.LOGGER).to(CustomLogger).inSingletonScope()
    }
}

export const DIContainer = new IoC().container
