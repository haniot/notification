import { injectable } from 'inversify'
import * as admin from 'firebase-admin'
import fs from 'fs'
import { IConnectionFirebase } from '../port/connection.firebase.interface'

/**
 * Implementation of the interface that provides connection with Firebase.
 * To implement the Firebase abstraction the firebase-admin library was used.
 *
 * @see {@link https://firebase.google.com/docs/reference/admin/} for more details.
 * @implements {IConnectionFirebase}
 */
@injectable()
export class ConnectionFirebase implements IConnectionFirebase {
    private _firebase_admin: any

    get firebase_admin(): any {
        return this._firebase_admin
    }

    set firebase_admin(value: any) {
        this._firebase_admin = value
    }

    /**
     * Reads the Google application credentials and use them to launch the Firebase Admin SDK.
     *
     * @return {Promise<void>}
     */
    public async init(): Promise<void> {
        try {
            const google_app_credentials_path = process.env.GOOGLE_APPLICATION_CREDENTIALS
            if (!google_app_credentials_path) {
                throw new Error('The Google Application Credentials path is required!')
            }

            const credentials_file: any = await this.readJSONFile(google_app_credentials_path)
            this.firebase_admin = await admin.initializeApp({
                credential: admin.credential.cert(credentials_file)
            })

            return Promise.resolve()
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
    private async readJSONFile(path: string): Promise<any> {
        try {
            const file: any = await fs.readFileSync(path)
            return Promise.resolve(JSON.parse(file))
        } catch (err) {
            return Promise.reject(err)
        }
    }
}
