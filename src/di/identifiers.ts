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
    public static readonly EMAIL_TEMPLATE_CONTROLLER: any = Symbol.for('EmailTemplateController')

    // Services
    public static readonly EMAIL_SERVICE: any = Symbol.for('EmailService')
    public static readonly EMAIL_TEMPLATE_SERVICE: any = Symbol.for('EmailTemplateService')

    // Repositories
    public static readonly EMAIL_REPOSITORY: any = Symbol.for('EmailRepository')
    public static readonly EMAIL_TEMPLATE_REPOSITORY: any = Symbol.for('EmailTemplateRepository')

    // Models
    public static readonly EMAIL_REPO_MODEL: any = Symbol.for('EmailRepoModel')

    // Mappers
    public static readonly EMAIL_ENTITY_MAPPER: any = Symbol.for('EmailEntityMapper')

    // Background Services
    public static readonly MONGODB_CONNECTION_FACTORY: any = Symbol.for('ConnectionFactoryMongodb')
    public static readonly MONGODB_CONNECTION: any = Symbol.for('ConnectionMongodb')
    public static readonly RABBITMQ_CONNECTION_FACTORY: any = Symbol.for('ConnectionFactoryRabbitMQ')
    public static readonly RABBITMQ_CONNECTION: any = Symbol.for('ConnectionRabbitMQ')
    public static readonly RABBITMQ_EVENT_BUS: any = Symbol.for('EventBusRabbitMQ')
    public static readonly BACKGROUND_SERVICE: any = Symbol.for('BackgroundService')
    public static readonly SUBSCRIBE_EVENT_BUS_TASK: any = Symbol.for('SubscribeEventBusTask')

    // Tasks
    public static readonly EVENT_BUS_TASK: any = Symbol.for('SubscribeEventBusTask')

    // Log
    public static readonly LOGGER: any = Symbol.for('CustomLogger')
}
