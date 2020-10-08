import fs from 'fs'
import { Default } from './default'
import {
    IDBOptions,
    IEventBusOptions,
    IFirebaseOptions,
    ISSL
} from '../infrastructure/port/connection.factory.interface'

export abstract class Config {

    /**
     * Retrieve the URI and options for connection to MongoDB.
     *
     * @return {
     *     uri: '',
     *     options: {
     *         sslValidate: true,
     *         tlsCAFile: '',
     *         tlsCertificateKeyFile: ''
     *     }
     * }
     */
    public static getMongoConfig(): IMongoConfig {
        return {
            uri: (process.env.NODE_ENV === 'test') ? (process.env.MONGODB_URI_TEST ||
                Default.MONGODB_URI_TEST) : (process.env.MONGODB_URI || Default.MONGODB_URI),
            options: (process.env.MONGODB_ENABLE_TLS === 'false') ? undefined : {
                sslValidate: true,
                tlsCAFile: fs.readFileSync(process.env.MONGODB_CA_PATH!),
                tlsCertificateKeyFile: fs.readFileSync(process.env.MONGODB_KEY_PATH!)
            } as IDBOptions
        } as IMongoConfig
    }

    /**
     * Retrieve the options for connection to Firebase.
     *
     * @return {
     *     options: {
     *         credential: admin.credential.Credential
     *     }
     * }
     */
    public static getFirebaseConfig(): IFirebaseConfig {
        const google_app_credentials_path = process.env.GOOGLE_APPLICATION_CREDENTIALS
        if (!google_app_credentials_path) {
            throw new Error('The Google Application Credentials path is required!')
        }
        const credentials_file: any = this.readJSONFile(google_app_credentials_path)
        return {
            options: {
                credentialsFilePath: credentials_file
            } as IFirebaseOptions
        } as IFirebaseConfig
    }

    /**
     * Reads the content of a path and converts its to JSON.
     *
     * @param path Content path to convert to JSON.
     * @return {Promise<any>}
     */
    private static readJSONFile(path: string): any {
        try {
            const file: any = fs.readFileSync(path)
            return JSON.parse(file)
        } catch (err) {
            throw err
        }
    }

    /**
     * Retrieve the URI and options for connection to RabbitMQ.
     *
     * @return {
     *     uri: '',
     *     options: {
     *         retries: 0,
     *         interval: 2000,
     *         sslOptions: {
     *             cert: '',
     *             key: '',
     *             ca: [''],
     *         }
     *     }
     * }
     */
    public static getRabbitConfig(): IRabbitConfig {
        const uri = process.env.RABBITMQ_URI || Default.RABBITMQ_URI
        return {
            uri,
            options: {
                retries: 0,
                interval: 2000,
                sslOptions: uri.indexOf('amqps') !== 0 ? undefined : {
                    cert: fs.readFileSync(process.env.RABBITMQ_CERT_PATH!),
                    key: fs.readFileSync(process.env.RABBITMQ_KEY_PATH!),
                    ca: [fs.readFileSync(process.env.RABBITMQ_CA_PATH!)]
                } as ISSL
            } as IEventBusOptions
        } as IRabbitConfig
    }
}

interface IMongoConfig {
    uri: string
    options: IDBOptions
}

interface IFirebaseConfig {
    options: IFirebaseOptions
}

interface IRabbitConfig {
    uri: string
    options: IEventBusOptions
}
