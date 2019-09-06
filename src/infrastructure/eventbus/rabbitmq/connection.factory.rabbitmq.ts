import { injectable } from 'inversify'
import { amqpClient } from 'amqp-client-node'
import { IConnectionFactory } from '../../port/connection.factory.interface'
import { Default } from '../../../utils/default'

@injectable()
export class ConnectionFactoryRabbitMQ implements IConnectionFactory {
    /**
     * Create instance of Event Bus
     *
     * @param _retries Total attempts to be made until give up reconnecting
     * @param _interval Interval in milliseconds between each attempt
     * @return Promise<Connection>
     */
    public async createConnection(_retries: number, _interval: number): Promise<any> {
        return amqpClient.createConnection(process.env.RABBITMQ_URI || Default.RABBITMQ_URI,
            { retries: _retries, interval: _interval })
    }
}
