import { BaseRepository } from './base/base.repository'
import { PushTokenEntity } from '../entity/push.token.entity'
import { PushToken } from '../../application/domain/model/push.token'
import { IPushTokenRepository } from '../../application/port/push.token.repository.interface'
import { inject, injectable } from 'inversify'
import { Identifier } from '../../di/identifiers'
import { IEntityMapper } from '../port/entity.mapper.interface'
import { ILogger } from '../../utils/custom.logger'
import { Query } from './query/query'

@injectable()
export class PushTokenRepository extends BaseRepository<PushToken, PushTokenEntity> implements IPushTokenRepository {
    constructor(
        @inject(Identifier.PUSH_TOKEN_REPO_MODEL) readonly _model: any,
        @inject(Identifier.PUSH_TOKEN_ENTITY_MAPPER) readonly _mapper: IEntityMapper<PushToken, PushTokenEntity>,
        @inject(Identifier.LOGGER) readonly _logger: ILogger
    ) {
        super(_model, _mapper, _logger)
    }

    public createOrUpdate(item: PushToken): Promise<PushToken> {
        const itemNew: any = this.mapper.transform(item)
        return new Promise<PushToken>((resolve, reject) => {
            this.Model.findOneAndUpdate(
                { user_id: item.user_id, client_type: item.client_type },
                itemNew,
                { new: true, upsert: true, setDefaultsOnInsert: true })
                .then(result => {
                    if (!result) return resolve(undefined)
                    return resolve(this.mapper.transform(result))
                })
        })
    }

    public deleteFromUser(userId: string, clientType: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.Model.findOneAndDelete({ user_id: userId, client_type: clientType })
                .then(result => resolve(!!result))
                .catch(err => reject(this.mongoDBErrorListener(err)))
        })
    }

    public findFromUser(userId: string, clientType: string): Promise<PushToken> {
        return super.findOne(new Query().fromJSON({ filters: { user_id: userId, client_type: clientType } }))
    }
}
