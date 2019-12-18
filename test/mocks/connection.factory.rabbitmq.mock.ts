import { IConnectionFactory, IEventBusOptions } from '../../src/infrastructure/port/connection.factory.interface'
import { Connection } from './connection.mock'

export class ConnectionFactoryRabbitmqMock implements IConnectionFactory {
     public createConnection(uri: string, options?: IEventBusOptions): Promise<any> {
        return Promise.resolve(new Connection())
    }
}
