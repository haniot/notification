export interface IIntegrationEventHandler<T> {
    handle(event: T): void
}
