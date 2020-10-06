import { IPushService } from '../port/push.service.interface'
import { inject, injectable } from 'inversify'
import { PushTypes, Push } from '../domain/model/push'
import { IQuery } from '../port/query.interface'
import { PushValidator } from '../domain/validator/push.validator'
import { Identifier } from '../../di/identifiers'
import { IPushRepository } from '../port/push.repository.interface'
import { ChoiceTypes } from '../domain/utils/choice.types'
import { ObjectIdValidator } from '../domain/validator/object.id.validator'
import { IPushTokenRepository } from '../port/push.token.repository.interface'
import { ValidationException } from '../domain/exception/validation.exception'
import { PushToken } from '../domain/model/push.token'

@injectable()
export class PushService implements IPushService {
    constructor(
        @inject(Identifier.PUSH_REPOSITORY) private readonly _pushRepo: IPushRepository,
        @inject(Identifier.PUSH_TOKEN_REPOSITORY) private readonly _pushTokenRepo: IPushTokenRepository
    ) {
    }

    public async send(item: Push): Promise<Push> {
        try {
            PushValidator.validate(item)
            if (item.type === PushTypes.DIRECT) {
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
            // Await mount the payload and send the push
            await this.sendPush(item)

            // If the push is of the direct type and is to be maintained, save it in the database
            if (item.type === PushTypes.DIRECT && item.keep_it === ChoiceTypes.YES) {
                const result: Push = await this._pushRepo.create(item)
                item.id = result.id
            }
            return Promise.resolve(item)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async add(item: Push): Promise<Push> {
        throw new Error('Not implemented')
    }

    public count(query: IQuery): Promise<number> {
        query.addFilter({ keep_it: ChoiceTypes.YES })
        return this._pushRepo.count(query)
    }

    public getAll(query: IQuery): Promise<Array<Push>> {
        query.addFilter({ keep_it: ChoiceTypes.YES })
        return this._pushRepo.find(query)
    }

    public getById(id: string, query: IQuery): Promise<Push> {
        try {
            ObjectIdValidator.validate(id)
            query.addFilter({ _id: id, keep_it: ChoiceTypes.YES })
            return this._pushRepo.findOne(query)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public remove(id: string): Promise<boolean> {
        try {
            ObjectIdValidator.validate(id)
            return this._pushRepo.delete(id)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public update(item: Push): Promise<Push> {
        throw new Error('Not implemented')
    }

    public confirmPushRead(id: string): Promise<boolean> {
        try {
            ObjectIdValidator.validate(id)
            return this._pushRepo.updateTokenReadStatus(id, ChoiceTypes.YES)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    private async sendPush(push: Push): Promise<void> {
        try {
            const payloads: Array<any> = await this.mountPayloads(push)
            for await(const payload of payloads) await this._pushRepo.send(payload)
            return Promise.resolve()
        } catch (err) {
            return Promise.reject(err)
        }
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
            eng: payload.eng
        })
    }

}
