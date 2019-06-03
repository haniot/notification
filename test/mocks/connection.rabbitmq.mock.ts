import { IConnectionEventBus } from '../../src/infrastructure/port/connection.event.bus.interface'
import { Connection } from './connection.mock'
import { IConnectionFactory } from '../../src/infrastructure/port/connection.factory.interface'

export class ConnectionRabbitmqMock implements IConnectionEventBus {
    private _connection?: Connection

    constructor(private readonly connectionFactory: IConnectionFactory) {
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

    public tryConnect(retries: number, interval: number): Promise<void> {
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
}
