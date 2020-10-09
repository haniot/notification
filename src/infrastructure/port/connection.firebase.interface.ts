import { IFirebaseOptions } from './connection.factory.interface'
import * as admin from 'firebase-admin'

export interface IConnectionFirebase {
    connection: admin.app.App

    open(options: IFirebaseOptions): Promise<void>
}
