import { injectable } from 'inversify'
import { IConnectionFirebaseFactory, IFirebaseOptions } from '../port/connection.factory.interface'
import admin from 'firebase-admin'
import fs from 'fs'

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
            const credentials_file: any = this._readJSONFile(options.credentialsFilePath)
            return Promise.resolve(admin.initializeApp({
                credential: admin.credential.cert(credentials_file)
            }))
        } catch (err) {
            return Promise.reject(err)
        }
    }

    /**
     * Reads the content of a path and converts its to JSON.
     *
     * @param path Content path to convert to JSON.
     * @return {Promise<any>}
     */
    private _readJSONFile(path: string): any {
        try {
            const file: any = fs.readFileSync(path)
            return JSON.parse(file)
        } catch (err) {
            throw err
        }
    }
}
