/**
 * Class that defines variables with default values.
 *
 * @see Variables defined in .env will have preference.
 * @see Be careful not to put critical data in this file as it is not in .gitignore.
 * Sensitive data such as database, passwords and keys should be stored in secure locations.
 *
 * @abstract
 */
export abstract class Strings {
    public static readonly APP: any = {
        TITLE: 'HANIoT Notification Service',
        APP_DESCRIPTION: 'Micro-service for sending notification of type email, sms and push.'
    }

    public static readonly USER: any = {
        PARAM_ID_NOT_VALID_FORMAT: 'Parameter {user_id} is not in valid format!'
    }

    public static readonly EMAIL: any = {
        NOT_FOUND: 'Email not found!',
        NOT_FOUND_DESCRIPTION: 'Email not found or already removed. A new operation for the same resource is not required.'
    }
    public static readonly PUSH_TOKEN: any = {
        NOT_FOUND: 'Push token not found!',
        NOT_FOUND_DESCRIPTION: 'Push token not found or already removed. A new operation for the same resource is not required.'
    }

    public static readonly EMAIL_TEMPLATE: any = {
        NOT_FOUND: 'Email template not found!',
        NOT_FOUND_DESCRIPTION: 'Email template not found or already removed. A new operation for the same resource is not required.'
    }


    public static readonly ERROR_MESSAGE: any = {
        NOT_MAPPED: 'Value not mapped for {0}:',
        NOT_MAPPED_DESC: 'The mapped values are:',
        REQUEST_BODY_INVALID: 'Unable to process request body!',
        REQUEST_BODY_INVALID_DESC: 'Please verify that the JSON provided in the request body has a valid format and try again.',
        ENDPOINT_NOT_FOUND: 'Endpoint {0} does not found!',
        UNEXPECTED: 'An unexpected error has occurred. Please try again later...',
        UUID_NOT_VALID_FORMAT: 'Some ID provided does not have a valid format!',
        UUID_NOT_VALID_FORMAT_DESC: 'A 24-byte hex ID similar to this: 507f191e810c19729de860ea is expected.'
    }

    public static readonly FIREBASE_ADMIN_ERROR: any = {
        INVALID_PAYLOAD: 'Some invalid argument was provided into the message parameters.',
        PAYLOAD_LIMIT_EXCEEDED: 'The maximum message size has been reached.',
        INVALID_TOKEN: 'The recipient token is invalid: {0}',
        INVALID_TOKEN_DESC: 'Please provide a new token to recipient and try again later.',
        TOKEN_NOT_REGISTERED: 'The recipient is not registered: {0}',
        TOKEN_NOT_REGISTERED_DESC: 'Probably the token has been expired or deleted. Please provide a new token and try again later.',
        MESSAGE_RATE_EXCEEDED: 'The maximum message rate has been reached for the destination: {0}.',
        MESSAGE_RATE_EXCEEDED_DESC: 'Please wait for a while before resending messages to this destination again.',
        DIRECT_MESSAGE_RATE_EXCEEDED: 'The maximum message rate has been reached for token: {0}.',
        DIRECT_MESSAGE_RATE_EXCEEDED_DESC: 'Please wait for a while before resending messages to this token again.',
        TOPICS_MESSAGE_RATE_EXCEEDED: 'The maximum message rate has been reached for topic: {0}.',
        TOPICS_MESSAGE_RATE_EXCEEDED_DESC: 'Please wait for a while before resending messages to this topic again.',
        MISMATCHED_CREDENTIAL: 'The credential used into Firebase Admin SDK is not allowed to send messages to the push token: {0}',
        MISMATCHED_CREDENTIAL_DESC: 'Please verify if the push token and the SDK credential belonging to the same project.',
        AUTHENTICATION_ERROR: 'The Firebase Admin SDK could not connect with the FCM Server.',
        AUTHENTICATION_ERROR_DESC: 'Please verify your SDK credentials and try again.',
        SERVER_UNAVAILABLE: 'The FCM Server is unavailable now. PLease try again later.',
        INTERNAL_ERROR: 'The FCM server encountered an error while trying to process the request. Please try again later.',
        UNKNOWN_ERROR: 'An unknown error has occurred. Please try again later.'
    }
}
