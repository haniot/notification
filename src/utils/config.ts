import fs from 'fs'
import { Default } from './default'
import {
    IDBOptions,
    IEventBusOptions,
    IFirebaseOptions,
    ISSL
} from '../infrastructure/port/connection.factory.interface'
import * as admin from 'firebase-admin'

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
    public static async getFirebaseConfig(): Promise<IFirebaseConfig> {
        const google_app_credentials_path = process.env.GOOGLE_APPLICATION_CREDENTIALS
        if (!google_app_credentials_path) {
            throw new Error('The Google Application Credentials path is required!')
        }
        const credentials_file: any = await this.readJSONFile(google_app_credentials_path)

        return Promise.resolve({
            options: {
                credential: admin.credential.cert(credentials_file)
            } as IFirebaseOptions
        } as IFirebaseConfig)
    }

    /**
     * Reads the content of a path and converts its to JSON.
     *
     * @param path Content path to convert to JSON.
     * @return {Promise<any>}
     */
    private static async readJSONFile(path: string): Promise<any> {
        try {
            const file: any = await fs.readFileSync(path)
            return Promise.resolve(JSON.parse(file))
        } catch (err) {
            return Promise.reject(err)
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
