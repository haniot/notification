import { IDisposable } from './disposable.interface'
import { IntegrationEvent } from '../../application/integration-event/event/integration.event'
import { IIntegrationEventHandler } from '../../application/integration-event/handler/integration.event.handler.interface'
import { IConnectionEventBus } from './connection.event.bus.interface'
import { IQuery } from '../../application/port/query.interface'

export interface IEventBus extends IDisposable {
    connectionPub: IConnectionEventBus
    connectionSub: IConnectionEventBus
    connectionRpcServer: IConnectionEventBus
    connectionRpcClient: IConnectionEventBus

    enableLogger(level?: string): void

    publish(event: IntegrationEvent<any>, routingKey: string): Promise<boolean>

    subscribe(
        event: IntegrationEvent<any>,
        handler: IIntegrationEventHandler<IntegrationEvent<any>>,
        routingKey: string
    ): Promise<boolean>

    provideResource(name: string, listener: (...any) => any): Promise<boolean>

    executeResource(serviceName: string, resourceName: string, query?: string | IQuery): Promise<any>
}
