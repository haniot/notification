import { expect } from 'chai'
import { DIContainer } from '../../../src/di/di'
import { Identifier } from '../../../src/di/identifiers'
import { EventBusRabbitMQ } from '../../../src/infrastructure/eventbus/rabbitmq/eventbus.rabbitmq'
import { IntegrationEvent } from '../../../src/application/integration-event/event/integration.event'
import { IIntegrationEventHandler } from '../../../src/application/integration-event/handler/integration.event.handler.interface'

const eventBus: EventBusRabbitMQ = DIContainer.get(Identifier.RABBITMQ_EVENT_BUS)

describe('EVENT BUS', () => {
    before(() => {
        eventBus.receiveFromYourself = true
    })

    after(async () => {
        try {
            await eventBus.connectionPub.dispose()
            await eventBus.connectionSub.dispose()
            await eventBus.connectionRpcServer.dispose()
            await eventBus.connectionRpcClient.dispose()
        } catch (err) {
            throw new Error('Failure on EventBus test: ' + err.message)
        }
    })

    describe('CONNECTION', () => {
        it('should return false when trying to publish up without connection.', () => {
            return eventBus
                .publish({} as IntegrationEvent<any>, '')
                .then((result: boolean) => {
                    expect(result).to.eql(false)
                })
        })

        it('should return false when trying to subscribe up without connection.', () => {
            return eventBus
                .subscribe(
                    {} as IntegrationEvent<any>,
                    {} as IIntegrationEventHandler<any>,
                    ''
                )
                .then((result: boolean) => {
                    expect(result).to.eql(false)
                })
        })

        it('should connect successfully to publish.', async () => {
            try {
                await eventBus.connectionPub.open(1, 500)
                expect(eventBus.connectionPub.isOpen).to.eql(true)
            } catch (err) {
                throw new Error('Failure on EventBus test: ' + err.message)
            }

        })

        it('should connect successfully to subscribe.', async () => {
            try {
                await eventBus.connectionSub.open(1, 500)
                expect(eventBus.connectionSub.isOpen).to.eql(true)
            } catch (err) {
                throw new Error('Failure on EventBus test: ' + err.message)
            }
        })
    })

    describe('SUBSCRIBE', () => {
        it('should return true to subscribe in TestOneEvent', async () => {
            try {
                await eventBus.connectionSub.open(1, 500)

                return eventBus
                    .subscribe(createEventFake('TestOneEvent'), createHandlerEventFake(),
                        'tests.one')
                    .then(result => {
                        expect(result).to.equal(true)
                    })
            } catch (err) {
                throw new Error('Failure on EventBus test: ' + err.message)
            }
        })

        it('should return true to subscribe in TestTwoEvent', async () => {
            try {
                await eventBus.connectionSub.open(1, 500)

                return eventBus
                    .subscribe(createEventFake('TestTwoEvent'), createHandlerEventFake(),
                        'tests.two')
                    .then(result => {
                        expect(result).to.equal(true)
                    })
            } catch (err) {
                throw new Error('Failure on EventBus test: ' + err.message)
            }
        })
    })

    describe('PUBLISH', () => {
        it('should return true for published TestOneEvent.', async () => {
            try {
                await eventBus.connectionPub.open(1, 500)

                return eventBus.publish(
                    createEventFake('TestOneEvent'),
                    'test.save')
                    .then((result: boolean) => {
                        expect(result).to.equal(true)
                    })
            } catch (err) {
                throw new Error('Failure on EventBus test: ' + err.message)
            }
        })

        it('should return true for published TestTwoEvent.', async () => {
            try {
                await eventBus.connectionPub.open(1, 500)

                return eventBus.publish(
                    createEventFake('TestTwoEvent'),
                    'test.two')
                    .then((result: boolean) => {
                        expect(result).to.equal(true)
                    })
            } catch (err) {
                throw new Error('Failure on EventBus test: ' + err.message)
            }
        })
    })

    describe('RPC', () => {
        it('should return true when initializing a resource provider.', async () => {
            try {
                await eventBus.connectionRpcServer.open(1, 500)

                return eventBus
                    .provideResource('resource.get', (query: string) => {
                        return { content: '123', original_query: query }
                    })
                    .then((result: boolean) => {
                        expect(result).to.equal(true)
                    })
            } catch (err) {
                throw new Error('Failure on EventBus test: ' + err.message)
            }
        })

        it('should return a requested resource.', async () => {
            try {
                await eventBus.connectionRpcClient.open(1, 500)

                await eventBus.provideResource('resource.test.get', (query: string) => {
                    return { content: '123', original_query: query }
                })

                return eventBus.executeResource('notification.service',
                    'resource.test.get', '?test=321')
                    .then(res => {
                        expect(res.content).to.have.property('content', '123')
                        expect(res.content).to.have.property('original_query', '?test=321')
                    })
            } catch (err) {
                throw new Error('Failure on EventBus test: ' + err.message)
            }
        })

        it('should return time out for a requested resource that is not being provided.', async () => {
            try {
                await eventBus.connectionRpcClient.open(1, 500)

                return eventBus.executeResource('notification.service',
                    'resource.find', '')
                    .catch(err => {
                        expect(err).to.be.an('error')
                    })
            } catch (err) {
                throw new Error('Failure on EventBus test: ' + err.message)
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
