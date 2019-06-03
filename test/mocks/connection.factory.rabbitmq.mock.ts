import { IConnectionFactory } from '../../src/infrastructure/port/connection.factory.interface'
import { Connection } from './connection.mock'

export class ConnectionFactoryRabbitmqMock implements IConnectionFactory {
     public createConnection(retries: number, interval: number): Promise<any> {
        return Promise.resolve(new Connection())
    }
}
