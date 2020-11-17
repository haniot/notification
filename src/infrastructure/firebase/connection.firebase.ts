import { inject, injectable } from 'inversify'
import * as admin from 'firebase-admin'
import { IConnectionFirebase } from '../port/connection.firebase.interface'
import { Identifier } from '../../di/identifiers'
import { IConnectionFirebaseFactory, IFirebaseOptions } from '../port/connection.factory.interface'

/**
 * Implementation of the interface that provides connection with Firebase.
 * To implement the Firebase abstraction the firebase-admin library was used.
 *
 * @see {@link https://firebase.google.com/docs/reference/admin/} for more details.
 * @implements {IConnectionFirebase}
 */
@injectable()
export class ConnectionFirebase implements IConnectionFirebase {
    private _connection!: admin.app.App

    constructor(
        @inject(Identifier.FIREBASE_CONNECTION_FACTORY) private readonly _connectionFactory: IConnectionFirebaseFactory
    ) {
    }

    get connection(): admin.app.App {
        return this._connection
    }

    set connection(value: admin.app.App ) {
        this._connection = value
    }

    /**
     * Reads the Google application credentials and use them to launch the Firebase Admin SDK.
     *
     * @param options {IFirebaseOptions} Firebase connection setup options.
     * @return {Promise<void>}
     */
    public async open(options: IFirebaseOptions): Promise<void> {
        try {
            this.connection = await this._connectionFactory.createInstance(options)
            return Promise.resolve()
        } catch (err) {
            return Promise.reject(err)
        }
    }
}
