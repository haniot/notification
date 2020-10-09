import { assert } from 'chai'
import { ApiExceptionManager } from '../../../src/ui/exception/api.exception.manager'
import { ValidationException } from '../../../src/application/domain/exception/validation.exception'
import { ApiException } from '../../../src/ui/exception/api.exception'
import { RepositoryException } from '../../../src/application/domain/exception/repository.exception'
import { ConflictException } from '../../../src/application/domain/exception/conflict.exception'
import { EventBusException } from '../../../src/application/domain/exception/eventbus.exception'
import { FirebaseClientException } from '../../../src/application/domain/exception/firebase.client.exception'

describe('EXCEPTIONS: ApiExceptionManager', () => {
    it('should return the ValidationException object transformed to ApiException with code 400, message and description.', () => {
        const exception: ApiException = ApiExceptionManager.build(
            new ValidationException('ValidationException message', 'ValidationException description')
        )

        assert.propertyVal(exception, 'code', 400)
        assert.propertyVal(exception, 'message', 'ValidationException message')
        assert.propertyVal(exception, 'description', 'ValidationException description')
    })

    it('should return the ValidationException object transformed to ApiException with code 400 and message.', () => {
        const exception: ApiException = ApiExceptionManager.build(new ValidationException('ValidationException message'))

        assert.propertyVal(exception, 'code', 400)
        assert.propertyVal(exception, 'message', 'ValidationException message')
        assert.propertyVal(exception, 'description', undefined)
    })

    it('should return the ConflictException object transformed to ApiException with code 409, message and description.', () => {
        const exception: ApiException = ApiExceptionManager.build(
            new ConflictException('ConflictException message', 'ConflictException description')
        )

        assert.propertyVal(exception, 'code', 409)
        assert.propertyVal(exception, 'message', 'ConflictException message')
        assert.propertyVal(exception, 'description', 'ConflictException description')
    })

    it('should return the ConflictException object transformed to ApiException with code 409 and message.', () => {
        const exception: ApiException = ApiExceptionManager.build(new ConflictException('ConflictException message'))

        assert.propertyVal(exception, 'code', 409)
        assert.propertyVal(exception, 'message', 'ConflictException message')
        assert.propertyVal(exception, 'description', undefined)
    })

    it('should return the RepositoryException object transformed to ApiException with code 500, message and description.', () => {
        const exception: ApiException = ApiExceptionManager.build(
            new RepositoryException('RepositoryException message', 'RepositoryException description')
        )

        assert.propertyVal(exception, 'code', 500)
        assert.propertyVal(exception, 'message', 'RepositoryException message')
        assert.propertyVal(exception, 'description', 'RepositoryException description')
    })

    it('should return the RepositoryException object transformed to ApiException with code 500 and message.', () => {
        const exception: ApiException = ApiExceptionManager.build(new RepositoryException('RepositoryException message'))

        assert.propertyVal(exception, 'code', 500)
        assert.propertyVal(exception, 'message', 'RepositoryException message')
        assert.propertyVal(exception, 'description', undefined)
    })

    it('should return the FirebaseClientException object transformed to ApiException with code 500, message and description.',
        () => {
            const exception: ApiException = ApiExceptionManager.build(
                new FirebaseClientException(500, 'FirebaseClientException message', 'FirebaseClientException description')
            )

            assert.propertyVal(exception, 'code', 500)
            assert.propertyVal(exception, 'message', 'FirebaseClientException message')
            assert.propertyVal(exception, 'description', 'FirebaseClientException description')
        })

    it('should return the FirebaseClientException object transformed to ApiException with code 500 and message.', () => {
        const exception: ApiException = ApiExceptionManager.build(
            new FirebaseClientException(500, 'FirebaseClientException message'))

        assert.propertyVal(exception, 'code', 500)
        assert.propertyVal(exception, 'message', 'FirebaseClientException message')
        assert.propertyVal(exception, 'description', undefined)
    })

    it('should return the EventBusException object transformed to ApiException with code 500, message and description.', () => {
        const exception: ApiException = ApiExceptionManager.build(
            new EventBusException('Event Bus error message', 'Event Bus error description'))

        assert.propertyVal(exception, 'code', 500)
        assert.propertyVal(exception, 'message', 'Event Bus error message')
        assert.propertyVal(exception, 'description', 'Event Bus error description')
    })

    it('should return the EventBusException object transformed to ApiException with code 500 and message.', () => {
        const exception: ApiException = ApiExceptionManager.build(new EventBusException('Event Bus error message'))

        assert.propertyVal(exception, 'code', 500)
        assert.propertyVal(exception, 'message', 'Event Bus error message')
        assert.propertyVal(exception, 'description', undefined)
    })

    it('should return the Error object transformed to ApiException with code 500 and message.', () => {
        const exception: ApiException = ApiExceptionManager.build(new Error('Error message'))

        assert.propertyVal(exception, 'code', 500)
        assert.propertyVal(exception, 'message', 'Error message')
        assert.propertyVal(exception, 'description', undefined)
    })
})
