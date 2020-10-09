import 'reflect-metadata'
import { Container } from 'inversify'
import { HomeController } from '../ui/controller/home.controller'
import { Identifier } from './identifiers'
import { EmailEntity } from '../infrastructure/entity/email.entity'
import { IEntityMapper } from '../infrastructure/port/entity.mapper.interface'
import { IConnectionDB } from '../infrastructure/port/connection.db.interface'
import { IConnectionFactory, IConnectionFirebaseFactory } from '../infrastructure/port/connection.factory.interface'
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
import { ConnectionFactoryMongodb } from '../infrastructure/database/connection.factory.mongodb'
import { ConnectionMongodb } from '../infrastructure/database/connection.mongodb'
import { EmailTemplateRepository } from '../infrastructure/repository/email.template.repository'
import { IEmailTemplateRepository } from '../application/port/email.template.repository.interface'
import { IEmailTemplateService } from '../application/port/email.template.service.interface'
import { EmailTemplateService } from '../application/service/email.template.service'
import { EmailTemplateController } from '../ui/controller/email.template.controller'
import { PushToken } from '../application/domain/model/push.token'
import { PushTokenEntity } from '../infrastructure/entity/push.token.entity'
import { PushTokenEntityMapper } from '../infrastructure/entity/mapper/push.token.entity.mapper'
import { PushTokenRepoModel } from '../infrastructure/database/schema/push.token.schema'
import { IPushTokenRepository } from '../application/port/push.token.repository.interface'
import { PushTokenRepository } from '../infrastructure/repository/push.token.repository'
import { IPushTokenService } from '../application/port/push.token.service.interface'
import { PushTokenService } from '../application/service/push.token.service'
import { UsersPushTokensController } from '../ui/controller/users.push.tokens.controller'
import { PushController } from '../ui/controller/push.controller'
import { UsersPushController } from '../ui/controller/users.push.controller'
import { IPushService } from '../application/port/push.service.interface'
import { PushService } from '../application/service/push.service'
import { IPushRepository } from '../application/port/push.repository.interface'
import { PushRepository } from '../infrastructure/repository/push.repository'
import { PushRepoModel } from '../infrastructure/database/schema/push.schema'
import { Push } from '../application/domain/model/push'
import { PushEntity } from '../infrastructure/entity/push.entity'
import { PushEntityMapper } from '../infrastructure/entity/mapper/push.entity.mapper'
import { IConnectionFirebase } from '../infrastructure/port/connection.firebase.interface'
import { ConnectionFirebase } from '../infrastructure/firebase/connection.firebase'
import { ConnectionFactoryFirebase } from '../infrastructure/firebase/connection.factory.firebase'

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
        this._container.bind<EmailTemplateController>(Identifier.EMAIL_TEMPLATE_CONTROLLER)
            .to(EmailTemplateController).inSingletonScope()
        this._container.bind<UsersPushTokensController>(Identifier.USERS_PUSH_TOKENS_CONTROLLER)
            .to(UsersPushTokensController).inSingletonScope()
        this._container.bind<PushController>(Identifier.PUSH_CONTROLLER)
            .to(PushController).inSingletonScope()
        this._container.bind<UsersPushController>(Identifier.USERS_PUSH_CONTROLLER)
            .to(UsersPushController).inSingletonScope()

        // Services
        this._container.bind<IEmailTemplateService>(Identifier.EMAIL_TEMPLATE_SERVICE)
            .to(EmailTemplateService).inSingletonScope()
        this._container.bind<IEmailService>(Identifier.EMAIL_SERVICE)
            .to(EmailService).inSingletonScope()
        this._container.bind<IPushTokenService>(Identifier.PUSH_TOKEN_SERVICE)
            .to(PushTokenService).inSingletonScope()
        this._container.bind<IPushService>(Identifier.PUSH_SERVICE)
            .to(PushService).inSingletonScope()

        // Repositories
        this._container.bind<IEmailRepository>(Identifier.EMAIL_REPOSITORY)
            .to(EmailRepository).inSingletonScope()
        this._container.bind<IEmailTemplateRepository>(Identifier.EMAIL_TEMPLATE_REPOSITORY)
            .to(EmailTemplateRepository).inSingletonScope()
        this._container.bind<IPushTokenRepository>(Identifier.PUSH_TOKEN_REPOSITORY)
            .to(PushTokenRepository).inSingletonScope()
        this._container.bind<IPushRepository>(Identifier.PUSH_REPOSITORY)
            .to(PushRepository).inSingletonScope()

        // Mongoose Schema
        this._container.bind(Identifier.EMAIL_REPO_MODEL).toConstantValue(EmailRepoModel)
        this._container.bind(Identifier.PUSH_TOKEN_REPO_MODEL).toConstantValue(PushTokenRepoModel)
        this._container.bind(Identifier.PUSH_REPO_MODEL).toConstantValue(PushRepoModel)

        // Mappers
        this._container
            .bind<IEntityMapper<Email, EmailEntity>>(Identifier.EMAIL_ENTITY_MAPPER)
            .to(EmailEntityMapper).inSingletonScope()
        this._container
            .bind<IEntityMapper<PushToken, PushTokenEntity>>(Identifier.PUSH_TOKEN_ENTITY_MAPPER)
            .to(PushTokenEntityMapper).inSingletonScope()
        this._container
            .bind<IEntityMapper<Push, PushEntity>>(Identifier.PUSH_ENTITY_MAPPER)
            .to(PushEntityMapper).inSingletonScope()

        // Background Services
        this._container
            .bind<IConnectionFactory>(Identifier.MONGODB_CONNECTION_FACTORY)
            .to(ConnectionFactoryMongodb).inSingletonScope()
        this._container
            .bind<IConnectionDB>(Identifier.MONGODB_CONNECTION)
            .to(ConnectionMongodb).inSingletonScope()
        this._container
            .bind<IConnectionFirebaseFactory>(Identifier.FIREBASE_CONNECTION_FACTORY)
            .to(ConnectionFactoryFirebase).inSingletonScope()
        this._container
            .bind<IConnectionFirebase>(Identifier.FIREBASE_CONNECTION)
            .to(ConnectionFirebase).inSingletonScope()
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

        // Tasks
        this._container
            .bind<IBackgroundTask>(Identifier.SUBSCRIBE_EVENT_BUS_TASK)
            .to(SubscribeEventBusTask).inSingletonScope()

        // Log
        this._container.bind<ILogger>(Identifier.LOGGER).to(CustomLogger).inSingletonScope()
    }
}

export const DIContainer = new IoC().container
