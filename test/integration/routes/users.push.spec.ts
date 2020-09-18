import { IConnectionDB } from '../../../src/infrastructure/port/connection.db.interface'
import { DIContainer } from '../../../src/di/di'
import { Identifier } from '../../../src/di/identifiers'
import { App } from '../../../src/app'
import { Config } from '../../../src/utils/config'
import { DatabaseUtils } from '../../utils/database.utils'
import { NotificationTypes, PushNotification } from '../../../src/application/domain/model/push.notification'
import { PushNotificationMock } from '../../mocks/push.notification.mock'
import { PushNotificationRepoModel } from '../../../src/infrastructure/database/schema/push.notification.schema'
import { expect } from 'chai'
import { GeneratorMock } from '../../mocks/generator.mock'

const dbConnection: IConnectionDB = DIContainer.get(Identifier.MONGODB_CONNECTION)
const app: App = DIContainer.get(Identifier.APP)
const request = require('supertest')(app.getExpress())

describe('Routes: Push', () => {
    const direct_notification: PushNotification =
        new PushNotificationMock(NotificationTypes.DIRECT, [GeneratorMock.generateObjectId()])

    before(async () => {
            try {
                const mongoConfigs = Config.getMongoConfig()
                await dbConnection.tryConnect(mongoConfigs.uri, mongoConfigs.options)
                await DatabaseUtils.deleteMany(PushNotificationRepoModel)
                await DatabaseUtils.create(PushNotificationRepoModel, direct_notification.toJSON())
            } catch (err) {
                throw new Error('Failure on UsersPushTokens test: ' + err.message)
            }
        }
    )

    after(async () => {
        try {
            await DatabaseUtils.deleteMany(PushNotificationRepoModel)
            await dbConnection.dispose()
        } catch (err) {
            throw new Error('Failure on UsersPushTokens test: ' + err.message)
        }
    })

    describe('GET /v1/users/:user_id/push', () => {
        context('when get the saved push notifications from user', () => {
            it('should return status code 200 and a list of push notifications', () => {
                return request
                    .get(`/v1/users/${direct_notification.to![0]}/push`)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        expect(res.body).to.not.be.empty
                        expect(res.body.length).to.be.eql(1)
                    })
            })
        })

        context('when the user does not have push notifications', () => {
            it('should return status code 200 and an empty list', () => {
                return request
                    .get(`/v1/users/${GeneratorMock.generateObjectId()}/push`)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        expect(res.body).to.be.empty
                        expect(res.body.length).to.be.eql(0)
                    })
            })
        })
    })

})
