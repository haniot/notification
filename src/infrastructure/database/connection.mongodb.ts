import { Connection } from 'mongoose'
import { inject, injectable } from 'inversify'
import { IConnectionFactory } from '../port/connection.factory.interface'
import { Identifier } from '../../di/identifiers'
import { IConnectionDB } from '../port/connection.db.interface'
import { ILogger } from '../../utils/custom.logger'
import { EventEmitter } from 'events'

/**
 * Implementation of the interface that provides connection with MongoDB.
 * To implement the MongoDB abstraction the mongoose library was used.
 *
 * @see {@link https://mongoosejs.com/} for more details.
 * @implements {IConnectionDB}
 */
@injectable()
export class ConnectionMongoDB implements IConnectionDB {
    private _connection?: Connection
    private readonly _eventConnection: EventEmitter

    constructor(
        @inject(Identifier.MONGODB_CONNECTION_FACTORY) private readonly _connectionFactory: IConnectionFactory,
        @inject(Identifier.LOGGER) private readonly _logger: ILogger
    ) {
        this._eventConnection = new EventEmitter()
    }

    get conn(): Connection | undefined {
        return this._connection
    }

    get eventConnection(): EventEmitter {
        return this._eventConnection
    }

    /**
     * Once connected, the reconnection policy is managed by the MongoDB driver,
     * the values set in the environment variables or in the default file are
     * used for the total number of retries and intervals between them.
     *
     * In case MongoDB is initially not available for a first connection,
     * a new attempt will be made every 2 seconds. After the successful
     * connection, reconnection will be automatically managed by the MongoDB driver.
     *
     * @param retries Total attempts to be made until give up reconnecting
     * @param interval Interval in milliseconds between each attempt
     * @return {Promise<void>}
     */
    public async tryConnect(retries: number, interval: number): Promise<void> {
        const _this = this
        await this._connectionFactory.createConnection(retries, interval)
            .then((connection: Connection) => {
                this._connection = connection
                this.connectionStatusListener(this._connection)
                this._eventConnection.emit('connected')
                this._logger.info('Connection established with MongoDB...')
            })
            .catch((err) => {
                this._connection = undefined
                this._eventConnection.emit('disconnected')
                this._logger.warn(`Error trying to connect for the first time with mongoDB: ${err.message}`)
                setTimeout(async () => {
                    _this.tryConnect(retries, interval).then()
                }, 2000)
            })
    }

    /**
     * Initializes connected and disconnected listeners.
     *
     * @param connection
     */
    private connectionStatusListener(connection: Connection | undefined): void {
        if (!connection) {
            this._connection = undefined
            this._eventConnection.emit('disconnected')
            return
        }

        connection.on('connected', () => {
            this._logger.warn('Reconnection established with MongoDB...')
            this._eventConnection.emit('connected')
        })

        connection.on('disconnected', () => {
            this._connection = undefined
            this._eventConnection.emit('disconnected')
            this._logger.warn('Connection to MongoDB was lost...')
        })
    }

    /**
     *  Close connection..
     *
     * @return {Promise<void>}
     */
    public dispose(): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            if (!this._connection) return resolve()
            this._connection.close()
                .then(() => {
                    this._connection = undefined
                    return resolve()
                })
                .catch(reject)
        })
    }
}
