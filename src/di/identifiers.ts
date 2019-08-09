/**
 * Constants used in dependence injection.
 *
 * @abstract
 */
export abstract class Identifier {
    public static readonly APP: any = Symbol.for('App')

    // Controllers
    public static readonly HOME_CONTROLLER: any = Symbol.for('HomeController')
    public static readonly EMAIL_CONTROLLER: any = Symbol.for('EmailController')

    // Services
    public static readonly EMAIL_SERVICE: any = Symbol.for('EmailService')

    // Repositories
    public static readonly EMAIL_REPOSITORY: any = Symbol.for('EmailRepository')
    public static readonly INTEGRATION_EVENT_REPOSITORY: any = Symbol.for('IntegrationEventRepository')

    // Models
    public static readonly EMAIL_REPO_MODEL: any = Symbol.for('EmailRepoModel')
    public static readonly INTEGRATION_EVENT_REPO_MODEL: any = Symbol.for('IntegrationEventRepoModel')

    // Mappers
    public static readonly EMAIL_ENTITY_MAPPER: any = Symbol.for('EmailEntityMapper')

    // Background Services
    public static readonly MONGODB_CONNECTION_FACTORY: any = Symbol.for('ConnectionFactoryMongoDB')
    public static readonly MONGODB_CONNECTION: any = Symbol.for('ConnectionMongoDB')
    public static readonly RABBITMQ_CONNECTION_FACTORY: any = Symbol.for('ConnectionFactoryRabbitMQ')
    public static readonly RABBITMQ_CONNECTION: any = Symbol.for('ConnectionRabbitMQ')
    public static readonly RABBITMQ_EVENT_BUS: any = Symbol.for('EventBusRabbitMQ')
    public static readonly BACKGROUND_SERVICE: any = Symbol.for('BackgroundService')
    public static readonly SUBSCRIBE_EVENT_BUS_TASK: any = Symbol.for('SubscribeEventBusTask')

    // Tasks
    public static readonly EVENT_BUS_TASK: any = Symbol.for('SubscribeEventTask')

    // Log
    public static readonly LOGGER: any = Symbol.for('CustomLogger')
}
