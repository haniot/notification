/**
 * Class that defines variables with default values.
 *
 * @see Variables defined in .env will have preference.
 * @see Be careful not to put critical data in this file as it is not in .gitignore.
 * Sensitive data such as database, passwords and keys should be stored in secure locations.
 *
 * @abstract
 */
export abstract class Default {
    public static readonly APP_ID: string = 'notification-service'
    public static readonly NODE_ENV: string = 'development' // development, test, production
    public static readonly PORT_HTTP: number = 7000
    public static readonly PORT_HTTPS: number = 7001
    public static readonly SWAGGER_URI: string = 'https://api.swaggerhub.com/apis/haniot/' +
        'haniot-notification-service/v1/swagger.json'
    public static readonly LOGO_URI: string = 'http://nutes.uepb.edu.br/wp-content/uploads/2014/01/icon.fw_.png'

    // MongoDB
    public static readonly MONGODB_URI: string = 'mongodb://127.0.0.1:27017/notification-service'
    public static readonly MONGODB_URI_TEST: string = 'mongodb://127.0.0.1:27017/notification-service-test'

    // RabbitMQ
    public static readonly RABBITMQ_HOST: string = '127.0.0.1:5672'
    public static readonly RABBITMQ_PORT: number = 5672
    public static readonly RABBITMQ_USERNAME: string = 'guest'
    public static readonly RABBITMQ_PASSWORD: string = 'guest'

    // Log
    public static readonly LOG_DIR: string = 'logs'

    // Certificate
    // To generate self-signed certificates, see: https://devcenter.heroku.com/articles/ssl-certificate-self
    public static readonly SSL_KEY_PATH: string = '.certs/server.key'
    public static readonly SSL_CERT_PATH: string = '.certs/server.crt'

    public static readonly IP_WHITELIST: Array<string> = ['*']
}
