import { App } from 'firebase-admin/app'

export interface IConnectionFactory {
    createConnection(uri: string, options?: IDBOptions | IEventBusOptions): Promise<any>
}

export interface IDBOptions {
}

export interface IConnectionFirebaseFactory {
    createInstance(options: IFirebaseOptions): Promise<App>
}

export interface IFirebaseOptions {
    is_enable: boolean
    credentialsFilePath: string
}

export interface IEventBusOptions {
    retries?: number
    interval?: number
    sslOptions?: ISSL
}

export interface ISSL {
    cert?: Buffer
    key?: Buffer
    ca?: Buffer[]
}
