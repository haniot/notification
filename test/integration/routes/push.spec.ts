import { IConnectionDB } from '../../../src/infrastructure/port/connection.db.interface'
import { DIContainer } from '../../../src/di/di'
import { Identifier } from '../../../src/di/identifiers'
import { App } from '../../../src/app'
import { Config } from '../../../src/utils/config'
import { DatabaseUtils } from '../../utils/database.utils'
import { PushTokenRepoModel } from '../../../src/infrastructure/database/schema/push.token.schema'
import { NotificationTypes, PushNotification } from '../../../src/application/domain/model/push.notification'
import { PushNotificationMock } from '../../mocks/push.notification.mock'
import { PushToken, PushTokenClientTypes } from '../../../src/application/domain/model/push.token'
import { PushTokenMock } from '../../mocks/push.token.mock'
import { PushNotificationRepoModel } from '../../../src/infrastructure/database/schema/push.notification.schema'
import { expect } from 'chai'
import { ChoiceTypes } from '../../../src/application/domain/utils/choice.types'
import { GeneratorMock } from '../../mocks/generator.mock'

const dbConnection: IConnectionDB = DIContainer.get(Identifier.MONGODB_CONNECTION)
const app: App = DIContainer.get(Identifier.APP)
const request = require('supertest')(app.getExpress())

describe('Routes: Push', () => {
    const direct_notification: PushNotification = new PushNotificationMock(NotificationTypes.DIRECT)
    const topic_notification: PushNotificationMock = new PushNotificationMock(NotificationTypes.TOPIC, ['default'])
    const push_token: PushToken = new PushTokenMock(PushTokenClientTypes.MOBILE)

    before(async () => {
            try {
                const mongoConfigs = Config.getMongoConfig()
                await dbConnection.tryConnect(mongoConfigs.uri, mongoConfigs.options)
                await DatabaseUtils.deleteMany(PushTokenRepoModel)
                await DatabaseUtils.deleteMany(PushNotificationRepoModel)
                const token: any = await DatabaseUtils.create(PushTokenRepoModel, push_token.toJSON())
                direct_notification.to = [token.user_id]
            } catch (err) {
                throw new Error('Failure on UsersPushTokens test: ' + err.message)
            }
        }
    )

    after(async () => {
        try {
            await DatabaseUtils.deleteMany(PushTokenRepoModel)
            await DatabaseUtils.deleteMany(PushNotificationRepoModel)
            await dbConnection.dispose()
        } catch (err) {
            throw new Error('Failure on UsersPushTokens test: ' + err.message)
        }
    })

    describe('POST /v1/push', () => {
        context('when send a direct push notification and keep it', () => {
            it('should return status code 201 and the notification', () => {
                return request
                    .post('/v1/push')
                    .send(direct_notification.toJSON())
                    .set('Content-Type', 'application/json')
                    .expect(201)
                    .then(res => {
                        expect(res.body).to.have.property('type', direct_notification.type)
                        expect(res.body).to.have.property('is_read', ChoiceTypes.NO)
                        expect(res.body).to.have.deep.property('to', direct_notification.to)
                        expect(res.body.message).to.have.property('type', direct_notification.message?.type)
                        expect(res.body.message.pt).to.have.property('title', direct_notification.message?.pt?.title)
                        expect(res.body.message.pt).to.have.property('text', direct_notification.message?.pt?.text)
                        expect(res.body.message.eng).to.have.property('title', direct_notification.message?.eng?.title)
                        expect(res.body.message.eng).to.have.property('text', direct_notification.message?.eng?.text)
                        direct_notification.id = res.body.id
                    })
            })
        })

        context('when send a direct push notification but not want keep it', () => {
            it('should return status code 201 and the notification', () => {
                return request
                    .post('/v1/push')
                    .send({ ...direct_notification.toJSON(), keep_it: ChoiceTypes.NO })
                    .set('Content-Type', 'application/json')
                    .expect(201)
                    .then(res => {
                        expect(res.body).to.have.property('type', direct_notification.type)
                        expect(res.body).to.have.deep.property('to', direct_notification.to)
                        expect(res.body.message).to.have.property('type', direct_notification.message?.type)
                        expect(res.body.message.pt).to.have.property('title', direct_notification.message?.pt?.title)
                        expect(res.body.message.pt).to.have.property('text', direct_notification.message?.pt?.text)
                        expect(res.body.message.eng).to.have.property('title', direct_notification.message?.eng?.title)
                        expect(res.body.message.eng).to.have.property('text', direct_notification.message?.eng?.text)
                    })
            })
        })

        context('when send a topic push notification', () => {
            it('should return status code 201 and the notification', () => {
                return request
                    .post('/v1/push')
                    .send(topic_notification.toJSON())
                    .set('Content-Type', 'application/json')
                    .expect(201)
                    .then(res => {
                        expect(res.body).to.have.property('type', topic_notification.type)
                        expect(res.body).to.have.deep.property('to', topic_notification.to)
                        expect(res.body.message).to.have.property('type', topic_notification.message?.type)
                        expect(res.body.message.pt).to.have.property('title', topic_notification.message?.pt?.title)
                        expect(res.body.message.pt).to.have.property('text', topic_notification.message?.pt?.text)
                        expect(res.body.message.eng).to.have.property('title', topic_notification.message?.eng?.title)
                        expect(res.body.message.eng).to.have.property('text', topic_notification.message?.eng?.text)
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should return status code 400 and message from missing parameters', () => {
                return request
                    .post('/v1/push')
                    .send({})
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message', 'Required fields were not provided...')
                        expect(res.body).to.have.property('description',
                            'Push Notification validation: type, keep_it, to, message required.')
                    })
            })

            it('should return status code 400 and message from invalid user id to direct message', () => {
                const random_id: string = GeneratorMock.generateObjectId()
                return request
                    .post('/v1/push')
                    .send({ ...direct_notification.toJSON(), to: [random_id] })
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message',
                            `Some user ids do not have saved push tokens for any type of client: ${random_id}.`)
                        expect(res.body).to.have.property('description', 'Please submit a valid user id and try again.')
                    })
            })
        })
    })

    describe('POST /v1/push/:push_id/read', () => {
        context('when want signalize that the push token are read', () => {
            it('should return status code 204 and no content', () => {
                return request
                    .post(`/v1/push/${direct_notification.id}/read`)
                    .set('Content-Type', 'application/json')
                    .expect(204)
                    .then(res => {
                        expect(res.body).to.be.empty
                    })
            })
        })
        context('when the push notification does not exists', () => {
            it('should return status code 204 and no content', () => {
                return request
                    .post(`/v1/push/${GeneratorMock.generateObjectId()}/read`)
                    .set('Content-Type', 'application/json')
                    .expect(204)
                    .then(res => {
                        expect(res.body).to.be.empty
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should return status code 400 and message from invalid push token id', () => {
                return request
                    .post('/v1/push/123/read')
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message', 'Some ID provided does not have a valid format!')
                        expect(res.body).to.have.property('description',
                            'A 24-byte hex ID similar to this: 507f191e810c19729de860ea is expected.')
                    })
            })
        })
    })

    describe('DELETE /v1/push/:push_id', () => {
        context('when delete a saved push notification', () => {
            it('should return status code 204 and no content', () => {
                return request
                    .delete(`/v1/push/${direct_notification.id}`)
                    .set('Content-Type', 'application/json')
                    .expect(204)
                    .then(res => {
                        expect(res.body).to.be.empty
                    })
            })
        })

        context('when the push token is already removed', () => {
            it('should return status code 204 and no content', () => {
                return request
                    .delete(`/v1/push/${direct_notification.id}`)
                    .set('Content-Type', 'application/json')
                    .expect(204)
                    .then(res => {
                        expect(res.body).to.be.empty
                    })
            })
        })


        context('when there are validation errors', () => {
            return request
                .delete('/v1/push/123')
                .set('Content-Type', 'application/json')
                .expect(400)
                .then(res => {
                    expect(res.body).to.have.property('message', 'Some ID provided does not have a valid format!')
                    expect(res.body).to.have.property('description',
                        'A 24-byte hex ID similar to this: 507f191e810c19729de860ea is expected.')
                })
        })
    })
})
