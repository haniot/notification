import HttpStatus from 'http-status-codes'
import { IPushClientRepository } from '../../application/port/push.client.repository.interface'
import { injectable } from 'inversify'
import * as admin from 'firebase-admin'
import fs from 'fs'
import { Strings } from '../../utils/strings'
import { FirebaseClientException } from '../../application/domain/exception/firebase.client.exception'


@injectable()
export class PushClientRepository implements IPushClientRepository {
    protected _firebase_admin?: any

    public send(payload: any): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this._firebase_admin.messaging().send(payload)
                .then(res => resolve(!!res))
                .catch(err => reject(this.firebaseAdminErrorListener(err)))
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
            return Promise.reject(this.firebaseAdminErrorListener(err))
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

    /*
    * Firebase Admin Sdk errors. For more information, consult the reference:
    * https://firebase.google.com/docs/cloud-messaging/send-message?hl=pt-br
    */

    private firebaseAdminErrorListener(err: any, recipient?: string) {
        if (err.errorInfo) {
            const info: any = err.errorInfo
            return {
                'messaging/invalid-payload': () => {
                    return new FirebaseClientException(
                        HttpStatus.BAD_REQUEST,
                        Strings.FIREBASE_ADMIN_ERROR.INVALID_PAYLOAD, err.message)
                },
                'messaging/payload-size-limit-exceeded': () => {
                    return new FirebaseClientException(
                        HttpStatus.REQUEST_TOO_LONG,
                        Strings.FIREBASE_ADMIN_ERROR.PAYLOAD_LIMIT_EXCEEDED)
                },
                'messaging/invalid-registration-token': () => {
                    return new FirebaseClientException(
                        HttpStatus.UNAUTHORIZED,
                        Strings.FIREBASE_ADMIN_ERROR.INVALID_TOKEN.replace(': {0}', recipient ? `: ${recipient}` : '.'),
                        Strings.FIREBASE_ADMIN_ERROR.INVALID_TOKEN_DESC)
                },
                'messaging/registration-token-not-registered': () => {
                    return new FirebaseClientException(
                        HttpStatus.UNAUTHORIZED,
                        Strings.FIREBASE_ADMIN_ERROR.TOKEN_NOT_REGISTERED.replace(': {0}', recipient ? `: ${recipient}` : '.'),
                        Strings.FIREBASE_ADMIN_ERROR.TOKEN_NOT_REGISTERED_DESC)
                },
                'messaging/message-rate-exceeded': () => {
                    return new FirebaseClientException(
                        HttpStatus.TOO_MANY_REQUESTS,
                        Strings.FIREBASE_ADMIN_ERROR.MESSAGE_RATE_EXCEEDED.replace(': {0}', recipient ? `: ${recipient}` : '.'),
                        Strings.FIREBASE_ADMIN_ERROR.MESSAGE_RATE_EXCEEDED_DESC)
                },
                'messaging/topics-message-rate-exceeded': () => {
                    return new FirebaseClientException(
                        HttpStatus.TOO_MANY_REQUESTS,
                        Strings.FIREBASE_ADMIN_ERROR.TOPICS_MESSAGE_RATE_EXCEEDED.replace(': {0}', recipient ? `: ${recipient}` : '.'),
                        Strings.FIREBASE_ADMIN_ERROR.TOPICS_MESSAGE_RATE_EXCEEDED_DESC)
                },
                'messaging/device-message-rate-exceeded': () => {
                    return new FirebaseClientException(
                        HttpStatus.TOO_MANY_REQUESTS,
                        Strings.FIREBASE_ADMIN_ERROR.DIRECT_MESSAGE_RATE_EXCEEDED.replace(': {0}', recipient ? `: ${recipient}` : '.'),
                        Strings.FIREBASE_ADMIN_ERROR.DIRECT_MESSAGE_RATE_EXCEEDED_DESC)
                },
                'messaging/mismatched-credential': () => {
                    return new FirebaseClientException(
                        HttpStatus.BAD_REQUEST,
                        Strings.FIREBASE_ADMIN_ERROR.MISMATCHED_CREDENTIAL.replace(': {0}', recipient ? `: ${recipient}` : '.'),
                        Strings.FIREBASE_ADMIN_ERROR.MISMATCHED_CREDENTIAL_DESC)
                },
                'messaging/authentication-error': () => {
                    return new FirebaseClientException(
                        HttpStatus.UNAUTHORIZED,
                        Strings.FIREBASE_ADMIN_ERROR.AUTHENTICATION_ERROR,
                        Strings.FIREBASE_ADMIN_ERROR.AUTHENTICATION_ERROR_DESC)
                },
                'messaging/server-unavailable': () => {
                    return new FirebaseClientException(
                        HttpStatus.SERVICE_UNAVAILABLE,
                        Strings.FIREBASE_ADMIN_ERROR.SERVER_UNAVAILABLE)
                },
                'messaging/internal-error': () => {
                    return new FirebaseClientException(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        Strings.FIREBASE_ADMIN_ERROR.INTERNAL_ERROR)
                },
                'messaging/unknown-error': () => {
                    return new FirebaseClientException(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        Strings.FIREBASE_ADMIN_ERROR.UNKNOWN_ERROR)
                }
            }[info.code || 'messaging/unknown-error']()
        }
        return new FirebaseClientException(HttpStatus.INTERNAL_SERVER_ERROR, Strings.FIREBASE_ADMIN_ERROR.UNKNOWN_ERROR)
    }
}
