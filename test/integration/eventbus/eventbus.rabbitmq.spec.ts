import { expect } from 'chai'
import { EventBusRabbitMQ } from '../../../src/infrastructure/eventbus/rabbitmq/eventbus.rabbitmq'
import { IntegrationEvent } from '../../../src/application/integration-event/event/integration.event'
import { IIntegrationEventHandler } from '../../../src/application/integration-event/handler/integration.event.handler.interface'
import { Default } from '../../../src/utils/default'
import { GenericPushSendEventMock } from '../../mocks/integration-event/generic.push.send.event.mock'
import { Push } from '../../../src/application/domain/model/push'
import { GenericPushSendEventHandlerMock } from '../../mocks/integration-event/generic.push.send.event.handler.mock'
import { ConnectionRabbitMQ } from '../../../src/infrastructure/eventbus/rabbitmq/connection.rabbitmq'
import { ConnectionFactoryRabbitMQ } from '../../../src/infrastructure/eventbus/rabbitmq/connection.factory.rabbitmq'

const eventBus: EventBusRabbitMQ = new EventBusRabbitMQ(
    new ConnectionRabbitMQ(new ConnectionFactoryRabbitMQ()),
    new ConnectionRabbitMQ(new ConnectionFactoryRabbitMQ()),
    new ConnectionRabbitMQ(new ConnectionFactoryRabbitMQ()),
    new ConnectionRabbitMQ(new ConnectionFactoryRabbitMQ())
)

describe('EVENTBUS: EventBusRabbitMQ', () => {
    before(() => {
        eventBus.receiveFromYourself = true
        eventBus.enableLogger('info')
    })

    // Stops RabbitMQ connections.
    after(async () => {
        try {
            await eventBus.dispose()
        } catch (err: any) {
            throw new Error('Failure on EventBusRabbitMQ test: ' + err.message)
        }
    })

    describe('CONNECTION', () => {
        it('should throw an error when trying to publish without connection.', async () => {
            return eventBus
                .publish(new GenericPushSendEventMock(new Date(), new Push()), GenericPushSendEventMock.ROUTING_KEY)
                .catch(err => {
                    expect(err).to.have.property('message', 'No connection open!')
                })
        })

        it('should throw an error when trying to subscribe up without connection.', () => {
            return eventBus
                .subscribe(
                    new GenericPushSendEventMock(),
                    new GenericPushSendEventHandlerMock(),
                    GenericPushSendEventMock.ROUTING_KEY
                )
                .catch(err => {
                    expect(err).to.have.property('message', 'No connection open!')
                })
        })

        it('should throw an error when trying to provide resource without connection.', async () => {
            return eventBus
                .provideResource('resource.test.get', (query: string) => {
                    return { content: '123', original_query: query }
                })
                .catch(err => {
                    expect(err).to.have.property('message', 'No connection open!')
                })
        })

        it('should throw an error when trying to request resource without connection.', async () => {
            return eventBus.executeResource('notification.rpc',
                'resource.test.get',
                '?test=321')
                .catch(err => {
                    expect(err).to.have.property('message', 'No connection open!')
                })
        })

        it('should connect successfully to publish.', async () => {
            try {
                await eventBus.connectionPub.open(process.env.RABBITMQ_URI || Default.RABBITMQ_URI,
                    { interval: 100, sslOptions: { ca: [] } })
                expect(eventBus.connectionPub.isOpen).to.eql(true)
            } catch (err: any) {
                throw new Error('Failure on EventBusRabbitMQ test: ' + err.message)
            }
        })

        it('should connect successfully to subscribe.', async () => {
            try {
                await eventBus.connectionSub.open(process.env.RABBITMQ_URI || Default.RABBITMQ_URI,
                    { interval: 100, sslOptions: { ca: [] } })
                expect(eventBus.connectionSub.isOpen).to.eql(true)
            } catch (err: any) {
                throw new Error('Failure on EventBusRabbitMQ test: ' + err.message)
            }
        })

        it('should connect successfully to provider.', async () => {
            try {
                await eventBus.connectionRpcServer.open(process.env.RABBITMQ_URI || Default.RABBITMQ_URI,
                    { interval: 100, sslOptions: { ca: [] } })
                expect(eventBus.connectionRpcServer.isOpen).to.eql(true)
            } catch (err: any) {
                throw new Error('Failure on EventBusRabbitMQ test: ' + err.message)
            }
        })

        it('should connect successfully to client.', async () => {
            try {
                await eventBus.connectionRpcClient.open(process.env.RABBITMQ_URI || Default.RABBITMQ_URI,
                    { interval: 100, sslOptions: { ca: [] } })
                expect(eventBus.connectionRpcClient.isOpen).to.eql(true)
            } catch (err: any) {
                throw new Error('Failure on EventBusRabbitMQ test: ' + err.message)
            }
        })
    })

    describe('SUBSCRIBE', () => {
        it('should return true to subscribe in TestOneEvent', async () => {
            try {
                await eventBus.connectionSub.open(process.env.RABBITMQ_URI || Default.RABBITMQ_URI,
                    { interval: 100, sslOptions: { ca: [] } })

                return eventBus
                    .subscribe(createEventFake('TestOneEvent'), createHandlerEventFake(),
                        'tests.one')
                    .then(result => {
                        expect(result).to.equal(true)
                    })
            } catch (err: any) {
                throw new Error('Failure on EventBusRabbitMQ test: ' + err.message)
            }
        })

        it('should return true to subscribe in TestTwoEvent', async () => {
            try {
                await eventBus.connectionSub.open(process.env.RABBITMQ_URI || Default.RABBITMQ_URI,
                    { interval: 100, sslOptions: { ca: [] } })

                return eventBus
                    .subscribe(createEventFake('TestTwoEvent'), createHandlerEventFake(),
                        'tests.two')
                    .then(result => {
                        expect(result).to.equal(true)
                    })
            } catch (err: any) {
                throw new Error('Failure on EventBusRabbitMQ test: ' + err.message)
            }
        })
    })

    describe('PUBLISH', () => {
        it('should return true for published TestOneEvent.', async () => {
            try {
                await eventBus.connectionPub.open(process.env.RABBITMQ_URI || Default.RABBITMQ_URI,
                    { interval: 100, sslOptions: { ca: [] } })

                return eventBus.publish(
                    createEventFake('TestOneEvent'),
                    'testone.save')
                    .then((result: boolean) => {
                        expect(result).to.equal(true)
                    })
            } catch (err: any) {
                throw new Error('Failure on EventBusRabbitMQ test: ' + err.message)
            }
        })

        it('should return true for published TestTwoEvent.', async () => {
            try {
                eventBus.enableLogger()

                await eventBus.connectionPub.open(process.env.RABBITMQ_URI || Default.RABBITMQ_URI,
                    { interval: 100, sslOptions: { ca: [] } })

                return eventBus.publish(
                    createEventFake('TestTwoEvent'),
                    'testtwo.save')
                    .then((result: boolean) => {
                        expect(result).to.equal(true)
                    })
            } catch (err: any) {
                throw new Error('Failure on EventBusRabbitMQ test: ' + err.message)
            }
        })
    })

    describe('RPC', () => {
        it('should return true when initializing a resource provider.', async () => {
            try {
                await eventBus.connectionRpcServer.open(process.env.RABBITMQ_URI || Default.RABBITMQ_URI,
                    { interval: 100, sslOptions: { ca: [] } })

                return eventBus
                    .provideResource('resource.test.get', (query: string) => {
                        return { content: '123', original_query: query }
                    })
                    .then((result: boolean) => {
                        expect(result).to.equal(true)
                    })
            } catch (err: any) {
                throw new Error('Failure on EventBusRabbitMQ test: ' + err.message)
            }
        })

        it('should return a requested resource.', async () => {
            try {
                await eventBus.connectionRpcServer.open(process.env.RABBITMQ_URI || Default.RABBITMQ_URI,
                    { interval: 100, sslOptions: { ca: [] } })

                await eventBus.provideResource('resource.test.get', (query: string) => {
                    return { content: '123', original_query: query }
                })

                await eventBus.connectionRpcClient.open(process.env.RABBITMQ_URI || Default.RABBITMQ_URI,
                    { interval: 100, sslOptions: { ca: [] } })

                return eventBus.executeResource('notification.rpc',
                    'resource.test.get',
                    '?test=321')
                    .then(res => {
                        expect(res).to.have.property('content', '123')
                        expect(res).to.have.property('original_query', '?test=321')
                    })
            } catch (err: any) {
                throw new Error('Failure on EventBusRabbitMQ test: ' + err.message)
            }
        })

        it('should return time out for a requested resource that is not being provided.', async () => {
            try {
                await eventBus.connectionRpcClient.open(process.env.RABBITMQ_URI || Default.RABBITMQ_URI,
                    { interval: 100, sslOptions: { ca: [] } })

                return eventBus.executeResource('notification.rpc',
                    'resource.find', '')
                    .catch(err => {
                        expect(err).to.be.an('error')
                    })
            } catch (err: any) {
                throw new Error('Failure on EventBusRabbitMQ test: ' + err.message)
            }
        })
    })
})

class TestEvent extends IntegrationEvent<any> {
    constructor(public event_name: string, public timestamp?: Date, public test?: any) {
        super(event_name, 'test', timestamp)
    }

    public toJSON(): any {
        if (!this.test) return {}
        return {
            ...super.toJSON(),
            ...{ test: this.test }
        }
    }
}

function createEventFake(name: string, item?: any): IntegrationEvent<any> {
    return new TestEvent(name, new Date(), item)
}

function createHandlerEventFake(): IIntegrationEventHandler<any> {
    return {
        handle(event: any): void {
            // not implemented
        }
    }
}
