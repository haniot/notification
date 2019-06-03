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

export class DI {
    private static instance: DI
    private readonly container: Container

    /**
     * Creates an instance of DI.
     *
     * @private
     */
    private constructor() {
        this.container = new Container()
        this.initDependencies()
    }

    /**
     * Recover single instance of class.
     *
     * @static
     * @return {App}
     */
    public static getInstance(): DI {
        if (!this.instance) this.instance = new DI()
        return this.instance
    }

    /**
     * Get Container inversify.
     *
     * @returns {Container}
     */
    public getContainer(): Container {
        return this.container
    }

    /**
     * Initializes injectable containers.
     *
     * @private
     * @return void
     */
    private initDependencies(): void {
        this.container.bind(Identifier.APP).to(App).inSingletonScope()

        // Controllers
        this.container.bind<HomeController>(Identifier.HOME_CONTROLLER)
            .to(HomeController).inSingletonScope()
        this.container.bind<EmailController>(Identifier.EMAIL_CONTROLLER)
            .to(EmailController).inSingletonScope()

        // Services
        this.container.bind<IEmailService>(Identifier.EMAIL_SERVICE)
            .to(EmailService).inSingletonScope()

        // Repositories
        this.container.bind<IEmailRepository>(Identifier.EMAIL_REPOSITORY)
            .to(EmailRepository).inSingletonScope()

        // Mongoose Schema
        this.container.bind(Identifier.EMAIL_REPO_MODEL).toConstantValue(EmailRepoModel)

        // Mappers
        this.container
            .bind<IEntityMapper<Email, EmailEntity>>(Identifier.EMAIL_ENTITY_MAPPER)
            .to(EmailEntityMapper).inSingletonScope()

        // Background Services
        this.container
            .bind<IConnectionFactory>(Identifier.MONGODB_CONNECTION_FACTORY)
            .to(ConnectionFactoryMongoDB).inSingletonScope()
        this.container
            .bind<IConnectionDB>(Identifier.MONGODB_CONNECTION)
            .to(ConnectionMongoDB).inSingletonScope()
        this.container
            .bind(Identifier.BACKGROUND_SERVICE)
            .to(BackgroundService).inSingletonScope()

        // Log
        this.container.bind<ILogger>(Identifier.LOGGER).to(CustomLogger).inSingletonScope()
    }
}
