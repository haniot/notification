import { IConnectionDB } from '../../../src/infrastructure/port/connection.db.interface'
import { DIContainer } from '../../../src/di/di'
import { Identifier } from '../../../src/di/identifiers'
import { App } from '../../../src/app'
import { Config } from '../../../src/utils/config'
import { DatabaseUtils } from '../../utils/database.utils'
import { PushTokenRepoModel } from '../../../src/infrastructure/database/schema/push.token.schema'
import { PushTypes, Push } from '../../../src/application/domain/model/push'
import { PushMock } from '../../mocks/models/push.mock'
import { PushToken, PushTokenClientTypes } from '../../../src/application/domain/model/push.token'
import { PushTokenMock } from '../../mocks/models/push.token.mock'
import { PushRepoModel } from '../../../src/infrastructure/database/schema/push.schema'
import { expect } from 'chai'
import { GeneratorMock } from '../../mocks/generator.mock'
import { Strings } from '../../../src/utils/strings'

const dbConnection: IConnectionDB = DIContainer.get(Identifier.MONGODB_CONNECTION)
const app: App = DIContainer.get(Identifier.APP)
const request = require('supertest')(app.getExpress())

describe('Routes: Push', () => {
    const direct_push: Push = new PushMock().generate(PushTypes.DIRECT)
    const push_token: PushToken = new PushTokenMock().generate(PushTokenClientTypes.MOBILE)

    before(async () => {
            try {
                const mongoConfigs = Config.getMongoConfig()
                await dbConnection.tryConnect(mongoConfigs.uri, mongoConfigs.options)
                await DatabaseUtils.deleteMany(PushTokenRepoModel)
                await DatabaseUtils.deleteMany(PushRepoModel)
                const token: any = await DatabaseUtils.create(PushTokenRepoModel, push_token.toJSON())
                direct_push.to = [token.user_id]
            } catch (err) {
                throw new Error('Failure on UsersPushTokens test: ' + err.message)
            }
        }
    )

    after(async () => {
        try {
            await DatabaseUtils.deleteMany(PushTokenRepoModel)
            await DatabaseUtils.deleteMany(PushRepoModel)
            await dbConnection.dispose()
        } catch (err) {
            throw new Error('Failure on UsersPushTokens test: ' + err.message)
        }
    })

    describe('POST /v1/push', () => {
        context('when there are validation errors', () => {
            it('should return status code 400 and message from missing parameters', () => {
                return request
                    .post('/v1/push')
                    .send({})
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message', Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS)
                        expect(res.body).to.have.property('description', Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS_DESC
                            .replace('{0}', 'type, keep_it, to, message'))
                    })
            })

            it('should return status code 400 and message from invalid user id to direct message', () => {
                const random_id: string = GeneratorMock.generateObjectId()
                return request
                    .post('/v1/push')
                    .send({ ...direct_push.toJSON(), to: [random_id] })
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
                    .post(`/v1/push/${direct_push.id}/read`)
                    .set('Content-Type', 'application/json')
                    .expect(204)
                    .then(res => {
                        expect(res.body).to.be.empty
                    })
            })
        })
        context('when the push does not exists', () => {
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
        context('when delete a saved push', () => {
            it('should return status code 204 and no content', () => {
                return request
                    .delete(`/v1/push/${direct_push.id}`)
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
                    .delete(`/v1/push/${direct_push.id}`)
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
