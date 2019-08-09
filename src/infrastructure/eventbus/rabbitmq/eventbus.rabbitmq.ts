import { amqpClient } from 'amqp-client-node'
import { inject, injectable } from 'inversify'
import { IEventBus } from '../../port/event.bus.interface'
import { IConnectionEventBus } from '../../port/connection.event.bus.interface'
import { IntegrationEvent } from '../../../application/integration-event/event/integration.event'
import { IIntegrationEventHandler } from '../../../application/integration-event/handler/integration.event.handler.interface'
import { Identifier } from '../../../di/identifiers'
import { IDisposable } from '../../port/disposable.interface'
import { EventBusException } from '../../../application/domain/exception/eventbus.exception'

@injectable()
export class EventBusRabbitMQ implements IEventBus, IDisposable {
    private readonly RABBITMQ_QUEUE_NAME: string = 'notification'
    private readonly RABBITMQ_RPC_QUEUE_NAME: string = 'notification.rpc'
    private readonly RABBITMQ_RPC_EXCHANGE_NAME: string = 'notification.rpc'
    private _receiveFromYourself: boolean
    private _event_handlers: Map<string, IIntegrationEventHandler<IntegrationEvent<any>>>
    private _rpcServer!: any
    private _rpcServerInitialized: boolean

    constructor(
        @inject(Identifier.RABBITMQ_CONNECTION) public connectionPub: IConnectionEventBus,
        @inject(Identifier.RABBITMQ_CONNECTION) public connectionSub: IConnectionEventBus,
        @inject(Identifier.RABBITMQ_CONNECTION) public connectionRpcServer: IConnectionEventBus,
        @inject(Identifier.RABBITMQ_CONNECTION) public connectionRpcClient: IConnectionEventBus
    ) {
        this._event_handlers = new Map()
        this._receiveFromYourself = false
        this._rpcServerInitialized = false
    }

    set receiveFromYourself(value: boolean) {
        this._receiveFromYourself = value
    }

    /**
     * Publish in topic.
     *
     * @param event {IntegrationEvent}
     * @param routingKey {string}
     * @return {Promise<boolean>}
     */
    public async publish(event: IntegrationEvent<any>, routingKey: string): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            if (!this.connectionPub.isOpen) return resolve(false)

            const message = { content: event.toJSON() }
            this.connectionPub
                .publish(event.type, routingKey, message, {
                    exchange: {
                        type: 'topic',
                        durable: true
                    }
                })
                .then(() => resolve(true))
                .catch(reject)
        })
    }

    /**
     * Subscribe in topic.
     *
     * @param event {IntegrationEvent}
     * @param handler {IIntegrationEventHandler<IntegrationEvent>}
     * @param routingKey {string}
     * @return {Promise<boolean>}
     */
    public async subscribe(event: IntegrationEvent<any>, handler: IIntegrationEventHandler<IntegrationEvent<any>>,
                           routingKey: string): Promise<any> {
        return new Promise<boolean>(async (resolve, reject) => {
            if (!this.connectionSub.isOpen) return resolve(false)
            if (this._event_handlers.has(event.event_name)) return resolve(true)

            this.connectionSub
                .subscribe(this.RABBITMQ_QUEUE_NAME, event.type, routingKey, (message) => {
                    message.ack()

                    const event_name: string = message.content.event_name
                    if (event_name) {
                        const event_handler: IIntegrationEventHandler<IntegrationEvent<any>> | undefined =
                            this._event_handlers.get(event_name)
                        if (event_handler) event_handler.handle(message.content)
                    }
                }, {
                    exchange: {
                        type: 'topic',
                        durable: true
                    }, queue: {
                        durable: true
                    },
                    consumer: {
                        noAck: false
                    },
                    receiveFromYourself: this._receiveFromYourself
                })
                .then(() => {
                    this._event_handlers.set(event.event_name, handler)
                    resolve(true)
                })
                .catch(reject)
        })
    }

    public provideResource(name: string, resource: (...any) => any): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            if (!this.connectionRpcServer.isOpen) {
                return reject(new EventBusException('No connection open!'))
            }

            this.initializeRPCServer()
            this._rpcServer.addResource(name, resource)

            this._rpcServer
                .start()
                .then(() => resolve(true))
                .catch(reject)
        })
    }

    public executeResource(serviceName: string, resourceName: string, queryString?: string): Promise<any> {
        if (!this.connectionRpcClient.isOpen) {
            return Promise.reject(new EventBusException('No connection open!'))
        }

        return this.connectionRpcClient
            .rpcClient(
                serviceName,
                resourceName,
                [queryString],
                {
                    exchange: {
                        type: 'direct',
                        durable: true
                    },
                    rcpTimeout: 5000
                })
    }

    private initializeRPCServer(): void {
        if (!this._rpcServerInitialized) {
            this._rpcServerInitialized = true
            this._rpcServer = this.connectionRpcServer
                .createRpcServer(
                    this.RABBITMQ_RPC_QUEUE_NAME,
                    this.RABBITMQ_RPC_EXCHANGE_NAME,
                    [],
                    {
                        exchange: {
                            type: 'direct',
                            durable: true
                        }, queue: {
                            durable: true
                        }
                    })
        }
    }

    /**
     * Releases the resources.
     *
     * @return {Promise<void>}
     */
    public async dispose(): Promise<void> {
        if (this.connectionPub) await this.connectionPub.close()
        if (this.connectionSub) await this.connectionSub.close()
        if (this.connectionRpcServer) await this.connectionRpcServer.close()
        if (this.connectionRpcClient) await this.connectionRpcClient.close()
        this._event_handlers.clear()
        return Promise.resolve()
    }

    public enableLogger(): void {
        amqpClient.logger('info')
    }
}
