import { injectable } from 'inversify'
import { IConnectionFirebaseFactory, IFirebaseOptions } from '../port/connection.factory.interface'
import admin from 'firebase-admin'

@injectable()
export class ConnectionFactoryFirebase implements IConnectionFirebaseFactory {
    /**
     * Creates instance of Firebase.
     *
     * @param options {IFirebaseOptions} Firebase connection setup options.
     * @return Promise<admin.app.App>
     */
    public createInstance(options: IFirebaseOptions): Promise<admin.app.App> {
        try {
            return Promise.resolve(admin.initializeApp({
                credential: admin.credential.cert(options.credentialsFilePath)
            }))
        } catch (err) {
            return Promise.reject(err)
        }
    }
}
