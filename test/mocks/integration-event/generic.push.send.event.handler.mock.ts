import { GenericPushSendEventMock } from './generic.push.send.event.mock'
import { IIntegrationEventHandler } from '../../../src/application/integration-event/handler/integration.event.handler.interface'

export class GenericPushSendEventHandlerMock implements IIntegrationEventHandler<GenericPushSendEventMock> {
    public handle(event: GenericPushSendEventMock): void {
        return
    }
}
