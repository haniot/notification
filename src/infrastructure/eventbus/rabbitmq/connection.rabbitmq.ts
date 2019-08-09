import { inject, injectable } from 'inversify'
import { IConnectionEventBus } from '../../port/connection.event.bus.interface'
import { IConnectionFactory } from '../../port/connection.factory.interface'
import { Identifier } from '../../../di/identifiers'
import { EventBusException } from '../../../application/domain/exception/eventbus.exception'

/**
 * Implementation of the interface that provides conn with RabbitMQ.
 * To implement the RabbitMQ abstraction the amqp-client-node library was used.
 *
 * @see {@link https://github.com/nutes-uepb/amqp-client-node} for more details.
 * @implements {IConnectionEventBus}
 */
@injectable()
export class ConnectionRabbitMQ implements IConnectionEventBus {
    private _connection!: any

    constructor(
        @inject(Identifier.RABBITMQ_CONNECTION_FACTORY) private readonly _connectionFactory: IConnectionFactory
    ) {
    }

    get isOpen(): boolean {
        return this._connection && this._connection.isOpen
    }

    /**
     * Routine to connect to RabbitMQ.
     * When there is no connection to RabbitMQ, new attempts
     * are made to connect according to the parameter {@link _options}
     * which sets the total number of retries and the delayIConnectionEventBus
     *
     * @param retries Total attempts to be made until give up reconnecting
     * @param interval Interval in milliseconds between each attempt
     * @return Promise<void>
     */
    public open(retries: number, interval: number): Promise<IConnectionEventBus> {
        return new Promise<IConnectionEventBus>((resolve, reject) => {
            if (this._connection && this._connection.isOpen) return resolve(this._connection)

            this._connectionFactory
                .createConnection(retries, interval)
                .then(connection => {
                    this._connection = connection
                    return resolve(this._connection)
                })
                .catch(err => {
                    return reject(err)
                })
        })
    }

    public on(event: string, listener: (...args: any[]) => void): void {
        this._connection.on(event, listener)
    }

    public publish(exchangeName: string, routingKey: string, message: any, options?: object): Promise<void> {
        if (!this.isOpen) return Promise.reject(new EventBusException('No connection open!'))
        return this._connection.pub(exchangeName, routingKey, message, options)
    }

    public subscribe(queueName: string, exchangeName: string, routingKey: string,
                     callback: (err: any, message: object) => void, options?: object): Promise<void> {
        if (!this.isOpen) return Promise.reject(new EventBusException('No connection open!'))
        return this._connection.sub(queueName, exchangeName, routingKey, callback, options)
    }

    public createRpcServer(queueName: string, exchangeName: string, routingKeys: string[], options?: object) {
        if (!this.isOpen) return Promise.reject(new EventBusException('No connection open!'))
        return this._connection.createRpcServer(queueName, exchangeName, routingKeys, options)
    }

    public rpcClient(exchangeName: string, resourceName: string, parameters: any[], options?: any): Promise<any> {
        if (!this.isOpen) return Promise.reject(new Error('Connection Failed'))
        return this._connection.rpcClient(exchangeName, resourceName, parameters, options)
    }

    public close(): Promise<boolean> {
        if (!this.isOpen) return Promise.resolve(true)
        return this._connection.close()
    }

    public dispose(): Promise<boolean> {
        if (!this.isOpen) return Promise.resolve(false)
        return this._connection.dispose()
    }
}
