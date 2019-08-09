import { inject, injectable } from 'inversify'
import { Identifier } from '../../di/identifiers'
import { IIntegrationEventRepository } from '../../application/port/integration.event.repository.interface'
import { IQuery } from '../../application/port/query.interface'
import { RepositoryException } from '../../application/domain/exception/repository.exception'
import { IntegrationEvent } from '../../application/integration-event/event/integration.event'

/**
 * Implementation of the integration event repository.
 *
 * @implements {IIntegrationEventRepository}
 */
@injectable()
export class IntegrationEventRepository implements IIntegrationEventRepository {
    constructor(
        @inject(Identifier.INTEGRATION_EVENT_REPO_MODEL) readonly model: any
    ) {
    }

    public create(item: any): Promise<IntegrationEvent<any>> {
        return new Promise<IntegrationEvent<any>>((resolve, reject) => {
            this.model.create(item)
                .then(result => resolve(result))
                .catch(err => reject(new RepositoryException(err)))
        })
    }

    public find(query: IQuery): Promise<Array<IntegrationEvent<any>>> {
        query.addOrdination('created_at', 'desc')

        const q: any = query.toJSON()
        return new Promise<Array<IntegrationEvent<any>>>((resolve, reject) => {
            this.model.find(q.filters)
                .sort(q.ordination)
                .exec() // execute query
                .then(result => resolve(result))
                .catch(err => reject(new RepositoryException(err)))
        })
    }

    public delete(id: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.model.findOneAndDelete({ _id: id })
                .exec()
                .then(result => {
                    if (!result) return resolve(false)
                    resolve(true)
                })
                .catch(err => reject(new RepositoryException(err)))
        })
    }

    public findOne(query: IQuery): Promise<IntegrationEvent<any>> {
        throw new Error('Not implemented!')
    }

    public update(item: object): Promise<IntegrationEvent<any>> {
        throw new Error('Not implemented!')
    }

    public count(query: IQuery): Promise<number> {
        throw new Error('Not implemented!')
    }
}
