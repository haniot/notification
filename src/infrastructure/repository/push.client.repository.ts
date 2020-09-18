import { IPushClientRepository } from '../../application/port/push.client.repository.interface'
import { inject, injectable } from 'inversify'
import * as admin from 'firebase-admin'
import { Identifier } from '../../di/identifiers'
import { ILogger } from '../../utils/custom.logger'
import fs from 'fs'


@injectable()
export class PushClientRepository implements IPushClientRepository {
    protected _firebase_admin?: any

    constructor(@inject(Identifier.LOGGER) private readonly _logger: ILogger) {
        this.initializeAdmin().then().catch()
    }

    public send(payload: any): Promise<any> {
        return new Promise<void>((resolve, reject) => {
            this._firebase_admin.messaging().send(payload)
                .then(res => resolve(res))
                .catch(err => reject(err))
        })
    }

    public sendToTopic(name: string, payload: any): Promise<any> {
        return new Promise<void>((resolve, reject) => {
            this._firebase_admin.messaging().sendToTopic(name, payload)
                .then(res => resolve(res))
                .catch(err => reject(err))
        })
    }

    private async initializeAdmin(): Promise<void> {
        try {
            const google_app_credentials_path = process.env.GOOGLE_APPLICATION_CREDENTIALS
            if (!google_app_credentials_path) {
                throw new Error('The Google Application Credentials path is required!')
            }
            const credentials_file: any = await this.readJSONFile(google_app_credentials_path)
            this._firebase_admin = await admin.initializeApp({
                credential: admin.credential.cert(credentials_file)
            })
            this._logger.info('Connection with the Google Firebase successful!')
            return Promise.resolve()
        } catch (err) {
            this._logger.error(`Could not initalize the Firebase SDK: ${err.message}`)
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
