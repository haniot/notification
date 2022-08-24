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
    public static readonly APP_ID: string = 'notification.app'
    public static readonly NODE_ENV: string = 'development' // development, test, production
    public static readonly PORT_HTTP: number = 7000
    public static readonly PORT_HTTPS: number = 7001
    public static readonly SWAGGER_URI: string = 'https://api.swaggerhub.com/apis/haniot/' +
        'notification-service/v1/swagger.json'
    public static readonly LOGO_URI: string = 'https://i.imgur.com/O7PxGWQ.png'

    // MongoDB
    public static readonly MONGODB_URI: string = 'mongodb://127.0.0.1:27017/notification-service'
    public static readonly MONGODB_URI_TEST: string = 'mongodb://127.0.0.1:27017/notification-service-test'

    // RabbitMQ
    public static readonly RABBITMQ_URI: string = 'amqp://guest:guest@localhost:5672'
    public static readonly RABBITMQ_RPC_TIMEOUT: number = 5000

    // Log
    public static readonly LOG_DIR: string = 'logs'

    // Certificate
    // To generate self-signed certificates, see: https://devcenter.heroku.com/articles/ssl-certificate-self
    public static readonly SSL_KEY_PATH: string = '.certs/server.key'
    public static readonly SSL_CERT_PATH: string = '.certs/server.crt'

    // The Google Firebase Config JSON file path for use firebase admin features.
    public static readonly FIREBASE_CREDENTIALS_PATH: string = '/path/to/firebase_credentials_file.json'

    // Dashboard Host
    public static readonly DASHBOARD_HOST: string = 'https://localhost:443'
}
