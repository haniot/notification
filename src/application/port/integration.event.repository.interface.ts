import { IRepository } from './repository.interface'
import { IntegrationEvent } from '../integration-event/event/integration.event'

/**
 * Interface of the integration event repository.
 * Must be implemented by the integration event repository at the infrastructure layer.
 *
 * @see {@link IntegrationEventRepository} for further information.
 * @extends {IRepository<any>}
 */
export interface IIntegrationEventRepository extends IRepository<IntegrationEvent<any>> {
}
