import { IJSONSerializable } from '../domain/utils/json.serializable.interface'
import { IJSONDeserializable } from '../domain/utils/json.deserializable.interface'

/**
 * Query interface.
 *
 * @extends {ISerializable<IQuery>}
 */
export interface IQuery extends IJSONSerializable, IJSONDeserializable<IQuery> {
    fields: Array<string>
    ordination: Map<string, string>
    pagination: IPagination
    filters: object

    addOrdination(field: string, order: string): void

    addFilter(filter: object): void
}

/**
 * Pagination interface.
 *
 * @extends {ISerializable<IQuery>}
 */
export interface IPagination extends IJSONSerializable, IJSONDeserializable<IPagination> {
    page: number
    limit: number
}
