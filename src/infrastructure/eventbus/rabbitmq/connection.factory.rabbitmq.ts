import { injectable } from 'inversify'
import { amqpClient } from 'amqp-client-node'
import { IConnectionFactory, IEventBusOptions } from '../../port/connection.factory.interface'

@injectable()
export class ConnectionFactoryRabbitMQ implements IConnectionFactory {
    private readonly options = {
        retries: 0,
        interval: 2000
    }

    /**
     * Create instance of Event Bus
     *
     * @param uri This specification defines an "amqp" URI scheme.
     * @param options {IEventBusOptions} Connection setup Options.
     * @return Promise<Connection>
     */
    public async createConnection(uri: string, options?: IEventBusOptions): Promise<any> {
        return amqpClient.createConnection(uri, { ...this.options, ...options })
    }
}
