import { IPushClientRepository } from '../../application/port/push.client.repository.interface'
import { injectable } from 'inversify'
import * as admin from 'firebase-admin'
import fs from 'fs'


@injectable()
export class PushClientRepository implements IPushClientRepository {
    protected _firebase_admin?: any

    public send(payload: any): Promise<any> {
        return new Promise<void>((resolve, reject) => {
            this._firebase_admin.messaging().send(payload)
                .then(res => resolve(res))
                .catch(err => reject(err))
        })
    }

    public async run(): Promise<void> {
        try {
            const google_app_credentials_path = process.env.GOOGLE_APPLICATION_CREDENTIALS
            if (!google_app_credentials_path) {
                throw new Error('The Google Application Credentials path is required!')
            }
            const credentials_file: any = await this.readJSONFile(google_app_credentials_path)
            this._firebase_admin = await admin.initializeApp({
                credential: admin.credential.cert(credentials_file)
            })
            return Promise.resolve()
        } catch (err) {
           return Promise.reject(err)
        }
    }

    private async readJSONFile(path: string): Promise<any> {
        try {
            const file: any = await fs.readFileSync(path)
            return Promise.resolve(JSON.parse(file))
        } catch (err) {
            return Promise.reject(err)
        }
    }
}
