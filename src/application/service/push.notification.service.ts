import { IPushNotificationService } from '../port/push.notification.service.interface'
import { inject, injectable } from 'inversify'
import { NotificationTypes, PushNotification } from '../domain/model/push.notification'
import { IQuery } from '../port/query.interface'
import { PushNotificationValidator } from '../domain/validator/push.notification.validator'
import { Identifier } from '../../di/identifiers'
import { IPushNotificationRepository } from '../port/push.notification.repository.interface'
import { IPushClientRepository } from '../port/push.client.repository.interface'
import { ChoiceTypes } from '../domain/utils/choice.types'
import { ObjectIdValidator } from '../domain/validator/object.id.validator'
import { IPushTokenRepository } from '../port/push.token.repository.interface'
import { ValidationException } from '../domain/exception/validation.exception'
import { PushToken } from '../domain/model/push.token'

@injectable()
export class PushNotificationService implements IPushNotificationService {
    constructor(
        @inject(Identifier.PUSH_NOTIFICATION_REPOSITORY) private readonly _pushNotificationRepo: IPushNotificationRepository,
        @inject(Identifier.PUSH_TOKEN_REPOSITORY) private readonly _pushTokenRepo: IPushTokenRepository,
        @inject(Identifier.PUSH_CLIENT_REPOSITORY) private readonly _pushClientRepo: IPushClientRepository
    ) {
    }

    public async send(item: PushNotification): Promise<PushNotification> {
        try {
            PushNotificationValidator.validate(item)
            if (item.type === NotificationTypes.DIRECT) {
                // List to store all users ids that does not have saved push tokens
                const users_not_exists: Array<string> = []
                for await (const id of item.to!) {
                    const push_tokens: Array<PushToken> = await this._pushTokenRepo.getUserTokens(id)
                    if (!push_tokens?.length) users_not_exists.push(id)
                }
                if (users_not_exists.length > 0) {
                    throw new ValidationException(
                        `Some user ids do not have saved push tokens for any type of client: ${users_not_exists.join(', ')}.`,
                        'Please submit a valid user id and try again.')
                }
            }
            // Await mount the payload and send the notification
            await this.sendNotification(item)

            // If the notification is of the direct type and is to be maintained, save it in the database
            if (item.type === NotificationTypes.DIRECT && item.keep_it === ChoiceTypes.YES) {
                item.is_read = ChoiceTypes.NO
                const result: PushNotification = await this._pushNotificationRepo.create(item)
                item.id = result.id
            }
            return Promise.resolve(item)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async add(item: PushNotification): Promise<PushNotification> {
        throw new Error('Not implemented')
    }

    public count(query: IQuery): Promise<number> {
        query.addFilter({ keep_it: ChoiceTypes.YES })
        return this._pushNotificationRepo.count(query)
    }

    public getAll(query: IQuery): Promise<Array<PushNotification>> {
        query.addFilter({ keep_it: ChoiceTypes.YES })
        return this._pushNotificationRepo.find(query)
    }

    public getById(id: string, query: IQuery): Promise<PushNotification> {
        try {
            ObjectIdValidator.validate(id)
            query.addFilter({ _id: id, keep_it: ChoiceTypes.YES })
            return this._pushNotificationRepo.findOne(query)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public remove(id: string): Promise<boolean> {
        try {
            ObjectIdValidator.validate(id)
            return this._pushNotificationRepo.delete(id)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public update(item: PushNotification): Promise<PushNotification> {
        throw new Error('Not implemented')
    }

    public confirmPushRead(id: string): Promise<boolean> {
        try {
            ObjectIdValidator.validate(id)
            return this._pushNotificationRepo.updateTokenReadStatus(id, ChoiceTypes.YES)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    private async sendNotification(notification: PushNotification): Promise<void> {
        try {
            const payloads: Array<any> = await this.mountPayloads(notification)
            for await(const payload of payloads) await this._pushClientRepo.send(payload)
            return Promise.resolve()
        } catch (err) {
            return Promise.reject(err)
        }
    }

    private async mountPayloads(item: PushNotification): Promise<Array<any>> {
        try {
            const result: Array<any> = []
            // Transform the message from object to json
            const message: any = item.message?.toJSON()
            // IF the type of notification is direct, the 'to' parameter should be an array of ids
            if (item.type === NotificationTypes.DIRECT) {
                for await(const owner_id of item.to!) {
                    // Get all push tokens from user, for any type of client
                    const push_tokens: Array<PushToken> = await this._pushTokenRepo.getUserTokens(owner_id)
                    // Create a notification payload for each push token
                    push_tokens.forEach(push_token => {
                        result.push({
                            token: push_token.token,
                            data: { type: message.type, body: this.serializePayloadBody(message) }
                        })
                    })
                }
                return Promise.resolve(result)
            }

            // If the type of notification is topic, the 'to' parameters should be an array of topic names
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
            eng: payload.eng
        })
    }

}
