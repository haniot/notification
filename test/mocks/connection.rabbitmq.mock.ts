import { IConnectionEventBus } from '../../src/infrastructure/port/connection.event.bus.interface'
import { Connection } from './connection.mock'
import { IConnectionFactory } from '../../src/infrastructure/port/connection.factory.interface'

export class ConnectionRabbitmqMock implements IConnectionEventBus {
    private _connection?: Connection
    private _isOpen: boolean

    constructor(private readonly connectionFactory: IConnectionFactory) {
        this._isOpen = true
    }

    get isConnected(): boolean {
        return this._connection ? this._connection.isConnected : false
    }

    set isConnected(value: boolean) {
        if (this._connection) this._connection.isConnected = value
    }

    get conn(): any {
        return new Connection()
    }

    get isOpen(): boolean {
        return this._isOpen
    }

    set isOpen(value: boolean) {
        this._isOpen = value
    }

    public open(retries: number, interval: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.connectionFactory.createConnection(1, 500)
                .then(conn => {
                    this._connection = conn
                    return resolve()
                })
                .catch(err => {
                    this._connection = undefined
                    return reject(err)
                })
        })
    }

    public close(): Promise<boolean> {
        return Promise.resolve(true)
    }

    public dispose(): Promise<boolean> {
        return Promise.resolve(true)
    }

    public on(event: string, listener: (...args: any[]) => void): void {
        // not implemented!
    }

    public publish(exchangeName: string, routingKey: string, message: any, options?: any): Promise<void> {
        return Promise.resolve()
    }

    public subscribe(queueName: string, exchangeName: string, routingKey: string,
                     callback: (err: any, message: any) => void, options?: any): Promise<void> {
        return Promise.resolve()
    }

    public createRpcServer(queueName: string, exchangeName: string, routingKeys: string[], options?: any): Promise<void> {
        return Promise.resolve()
    }

    public rpcClient(exchangeName: string, resourceName: string, parameters: any[],
                     optOrCall?: any | ((err: any, message: any) => void), options?: any): any {
        // not implemented!
    }
}
