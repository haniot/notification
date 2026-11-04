import { App, cert, initializeApp } from 'firebase-admin/app'
import fs from 'fs'
import { injectable } from 'inversify'
import { IConnectionFirebaseFactory, IFirebaseOptions } from '../port/connection.factory.interface'

@injectable()
export class ConnectionFactoryFirebase implements IConnectionFirebaseFactory {
    /**
     * Creates instance of Firebase.
     *
     * @param options {IFirebaseOptions} Firebase connection setup options.
     * @return Promise<App>
     */
    public createInstance(options: IFirebaseOptions): Promise<App> {
        try {
            const credentials_file: any = this._readJSONFile(options.credentialsFilePath)
            return Promise.resolve(initializeApp({
                credential: cert(credentials_file)
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
        const file: any = fs.readFileSync(path)
        return JSON.parse(file)
    }
}
