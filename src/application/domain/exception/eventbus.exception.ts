import { Exception } from './exception'

/**
 * Event bus exception.
 *
 * @extends {Exception}
 */
export class EventBusException extends Exception {
    /**
     * Creates an instance of EventBusException.
     *
     * @param message Short message
     * @param description Detailed message
     */
    constructor(message: string, description?: string) {
        super(message, description)
    }
}
