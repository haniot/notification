import { Exception } from './exception'

/**
 * Conflict data exception.
 *
 * @extends {Exception}
 */
export class FirebaseClientException extends Exception {
    public code: number

    /**
     * Creates an instance of ConflictException.
     *
     * @param code
     * @param message Short message
     * @param description Detailed message
     */
    constructor(code: number, message: string, description?: string) {
        super(message, description)
        this.code = code
    }
}
