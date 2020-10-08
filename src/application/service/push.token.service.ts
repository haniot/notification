import { IPushTokenService } from '../port/push.token.service.interface'
import { inject, injectable } from 'inversify'
import { Identifier } from '../../di/identifiers'
import { IPushTokenRepository } from '../port/push.token.repository.interface'
import { PushToken, PushTokenClientTypes } from '../domain/model/push.token'
import { PushTokenValidator } from '../domain/validator/push.token.validator'
import { ObjectIdValidator } from '../domain/validator/object.id.validator'
import { EnumValuesValidator } from '../domain/validator/enum.values.validator'
import { Strings } from '../../utils/strings'

@injectable()
export class PushTokenService implements IPushTokenService {
    constructor(
        @inject(Identifier.PUSH_TOKEN_REPOSITORY) private readonly _pushTokenRepo: IPushTokenRepository
    ) {
    }

    public async findFromUserAndType(userId: string, clientType: string): Promise<PushToken> {
        try {
            ObjectIdValidator.validate(userId, Strings.USER.PARAM_ID_NOT_VALID_FORMAT)
            EnumValuesValidator.validate(clientType, 'client_type', PushTokenClientTypes)
            const result: PushToken = await this._pushTokenRepo.findFromUserAndType(userId, clientType)
            return Promise.resolve(result)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async createOrUpdate(item: PushToken): Promise<PushToken> {
        try {
            PushTokenValidator.validate(item)
            const result: PushToken = await this._pushTokenRepo.createOrUpdate(item)
            return Promise.resolve(result)
        } catch (err) {
            return Promise.reject(err)
        }
    }

    public async deleteFromUser(userId: string, clientType: string): Promise<boolean> {
        try {
            ObjectIdValidator.validate(userId, Strings.USER.PARAM_ID_NOT_VALID_FORMAT)
            EnumValuesValidator.validate(clientType, 'client_type', PushTokenClientTypes)
            const result: boolean = await this._pushTokenRepo.deleteFromUser(userId, clientType)
            return Promise.resolve(result)
        } catch (err) {
            return Promise.reject(err)
        }
    }

}
