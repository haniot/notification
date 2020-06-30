import { IPagination, IQuery } from '../../../application/port/query.interface'
import { Pagination } from './pagination'

/**
 * Defines object to be used for queries.
 *
 * @example
 * ```typescript
 * const fields: Array<string> = new Array('name', 'email')
 * const ordination: Map<string, string> = new Map().set('created_at', '-1') // descending order
 * const pagination: Pagination = new Pagination(1, 10)
 * const filters: object = {
 *      created_at: { $gte: '2018-07-30T00:00:00.000Z' },
 *      email: { $regex: '^lorem', $options: 'i' }
 * }
 *
 * // Creating query instance
 * const query = new Query(fields, ordination, pagination, req.query.filters)
 * ```
 * @implements {IQuery}
 */
export class Query implements IQuery {
    private _fields!: Array<string> // Defines the attributes that should be returned.
    private _ordination!: Map<string, number> // Defines the attributes and how they should be sorted (ascending or descending).
    private _pagination!: IPagination // Defines maximum page and number of data to be returned.
    private _filters!: object // Defines rules for filtering, such as filtering by some attribute.

    /**
     *  Creates an instance of Query.
     *
     * @param fields
     * @param ordination
     * @param pagination
     * @param filters
     */
    constructor(fields?: Array<string>, ordination?: Map<string, number>,
                pagination?: IPagination, filters?: object) {
        this.fields = fields ? fields : []
        this.ordination = ordination ? ordination : new Map()
        this.pagination = pagination ? pagination : new Pagination()
        this.filters = filters ? filters : {}
    }

    get fields(): Array<string> {
        return this._fields
    }

    set fields(value: Array<string>) {
        this._fields = value
    }

    get ordination(): Map<string, number> {
        return this._ordination
    }

    set ordination(value: Map<string, number>) {
        this._ordination = value
    }

    get pagination(): IPagination {
        return this._pagination
    }

    set pagination(value: IPagination) {
        this._pagination = value
    }

    get filters(): object {
        return this._filters
    }

    set filters(value: object) {
        this._filters = value
    }

    public addOrdination(field: string, order: number): void {
        if (!this.ordination) this.ordination = new Map()
        this.ordination.set(field, order)
    }

    public addFilter(filter: object): void {
        this.filters = {
            ...this.filters,
            ...filter
        }
    }

    public fromJSON(json: any): Query {
        if (!json) return this

        if (json.fields) {
            this.fields = Object.keys(json.fields).map((elem) => elem, [])
        }

        if (json.sort || json.ordination) {
            const __ordination: Map<string, number> = new Map()
            Object.keys((json.sort || json.ordination))
                .reduce((prev, elem) => __ordination
                    .set(elem, (json.sort ? json.sort[elem] : json.ordination[elem])), {})
            this.ordination = __ordination
        }

        if (json.pagination) this.pagination = new Pagination().fromJSON(json.pagination)
        if (json.filters) this.filters = json.filters

        return this
    }

    public toJSON(): any {
        return {
            fields: this.fields ? [...this.fields].reduce((obj, value, key) => (obj[value] = 1, obj), {}) : [],
            ordination: this.ordination.size > 0 ?
                [...this.ordination.entries()]
                    .reduce((obj, [key, value]) => (obj[key] = value, obj), {}) : { created_at: -1 },
            pagination: this.pagination.toJSON(),
            filters: this.filters
        }
    }
}
