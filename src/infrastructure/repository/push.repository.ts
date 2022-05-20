import { BaseRepository } from './base/base.repository'
import { Push, PushTypes } from '../../application/domain/model/push'
import { PushEntity } from '../entity/push.entity'
import { IPushRepository } from '../../application/port/push.repository.interface'
import { inject, injectable } from 'inversify'
import { Identifier } from '../../di/identifiers'
import { ILogger } from '../../utils/custom.logger'
import { IConnectionFirebase } from '../port/connection.firebase.interface'
import { FirebaseClientException } from '../../application/domain/exception/firebase.client.exception'
import HttpStatus from 'http-status-codes'
import { Strings } from '../../utils/strings'
import { PushToken } from '../../application/domain/model/push.token'
import { IPushTokenRepository } from '../../application/port/push.token.repository.interface'

@injectable()
export class PushRepository extends BaseRepository<Push, PushEntity> implements IPushRepository {

    constructor(
        @inject(Identifier.PUSH_REPO_MODEL) readonly _model: any,
        @inject(Identifier.PUSH_ENTITY_MAPPER) readonly _mapper: any,
        @inject(Identifier.LOGGER) readonly _logger: ILogger,
        @inject(Identifier.PUSH_TOKEN_REPOSITORY) readonly _pushTokenRepo: IPushTokenRepository,
        @inject(Identifier.FIREBASE_CONNECTION) readonly _firebase: IConnectionFirebase
    ) {
        super(_model, _mapper, _logger)
    }

    public updateTokenReadStatus(id: string, is_read: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this._model.findOneAndUpdate({ _id: id }, { $set: { is_read } })
                .then(res => resolve(!!res))
                .catch(err => reject(super.mongoDBErrorListener(err)))
        })
    }

    public async send(push: Push): Promise<void> {
        try {
            const payloads: Array<any> = await this.mountPayloads(push)
            for await(const payload of payloads) await this.sendPayload(payload)
            return Promise.resolve()
        } catch (err) {
            return Promise.reject(err)
        }
    }

    private sendPayload(payload: any): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this._firebase.connection.messaging().send(payload)
                .then(res => resolve(!!res))
                .catch(err => reject(this.firebaseAdminErrorListener(err)))
        })
    }

    private async mountPayloads(item: Push): Promise<Array<any>> {
        try {
            const result: Array<any> = []
            // Transform the message from object to json
            const message: any = item.message?.toJSON()
            // If the type of push is direct, the 'to' parameter should be an array of ids
            if (item.type === PushTypes.DIRECT) {
                for await(const owner_id of item.to!) {
                    // Get all push tokens from user, for any type of client
                    const push_tokens: Array<PushToken> = await this._pushTokenRepo.getUserTokens(owner_id)
                    // Create a push payload for each push token
                    push_tokens.forEach(push_token => {
                        result.push({
                            token: push_token.token,
                            data: { type: message.type, body: this.serializePayloadBody(message) }
                        })
                    })
                }
                return Promise.resolve(result)
            }

            // If the type of push is topic, the 'to' parameters should be an array of topic names
            item.to!.forEach(topic => result.push({
                topic,
                data: { type: message.type, body: this.serializePayloadBody(message) }
            }))
            return Promise.resolve(result)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    private serializePayloadBody(payload: any): any {
        return JSON.stringify({
            pt: payload.pt,
            en: payload.en
        })
    }

    /*
    * Firebase Admin Sdk errors. For more information, consult the reference:
    * https://firebase.google.com/docs/cloud-messaging/send-message?hl=pt-br#admin
    */
    private firebaseAdminErrorListener(err: any, recipient?: string) {
        if (err.errorInfo) {
            const info: any = err.errorInfo
            const errorLiterals = {
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
                'messaging/invalid-argument': () => {
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
            }

            return (errorLiterals[info.code] || errorLiterals['messaging/unknown-error'])()
        }
        return new FirebaseClientException(HttpStatus.INTERNAL_SERVER_ERROR, Strings.FIREBASE_ADMIN_ERROR.UNKNOWN_ERROR)
    }
}
