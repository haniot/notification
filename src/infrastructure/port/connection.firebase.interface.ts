import { App } from 'firebase-admin/app'
import { IFirebaseOptions } from './connection.factory.interface'

export interface IConnectionFirebase {
    connection: App

    open(options: IFirebaseOptions): Promise<void>
}
