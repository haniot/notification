import { IDisposable } from './disposable.interface'
import { EventEmitter } from 'events'

export interface IConnectionDB extends IDisposable {
    eventConnection: EventEmitter

    tryConnect(retries: number, interval: number): void
}
