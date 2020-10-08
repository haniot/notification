import { IConnectionDB } from '../../../src/infrastructure/port/connection.db.interface'
import { DIContainer } from '../../../src/di/di'
import { Identifier } from '../../../src/di/identifiers'
import { App } from '../../../src/app'
import { Config } from '../../../src/utils/config'
import { DatabaseUtils } from '../../utils/database.utils'
import { PushTokenRepoModel } from '../../../src/infrastructure/database/schema/push.token.schema'
import { PushTokenMock } from '../../mocks/models/push.token.mock'
import { PushToken, PushTokenClientTypes } from '../../../src/application/domain/model/push.token'
import { expect } from 'chai'
import { Strings } from '../../../src/utils/strings'
import { GeneratorMock } from '../../mocks/generator.mock'

const dbConnection: IConnectionDB = DIContainer.get(Identifier.MONGODB_CONNECTION)
const app: App = DIContainer.get(Identifier.APP)
const request = require('supertest')(app.getExpress())

describe('Routes: UsersPushTokens', () => {
    const mobile_push_token: PushToken = new PushTokenMock().generate(PushTokenClientTypes.MOBILE)
    const web_push_token: PushToken = new PushTokenMock().generate(PushTokenClientTypes.WEB)

    before(async () => {
            try {
                const mongoConfigs = Config.getMongoConfig()
                await dbConnection.tryConnect(mongoConfigs.uri, mongoConfigs.options)
                await DatabaseUtils.deleteMany(PushTokenRepoModel, {})
            } catch (err) {
                throw new Error('Failure on UsersPushTokens test: ' + err.message)
            }
        }
    )

    after(async () => {
        try {
            await DatabaseUtils.deleteMany(PushTokenRepoModel, {})
            await dbConnection.dispose()
        } catch (err) {
            throw new Error('Failure on UsersPushTokens test: ' + err.message)
        }
    })

    describe('PUT /v1/users/:user_id/push/:client_type/tokens', () => {
        context('when save a mobile client token', () => {
            it('should return status code 204 and no content', () => {
                return request
                    .put(`/v1/users/${mobile_push_token.user_id}/push/${PushTokenClientTypes.MOBILE}/tokens`)
                    .send(mobile_push_token.toJSON())
                    .set('Content-Type', 'application/json')
                    .expect(204)
                    .then(res => {
                        expect(res.body).to.be.empty
                    })
            })
        })

        context('when save a web client token from same user', () => {
            it('should return status code 204 and no content', () => {
                return request
                    .put(`/v1/users/${mobile_push_token.user_id}/push/${PushTokenClientTypes.WEB}/tokens`)
                    .send(web_push_token.toJSON())
                    .set('Content-Type', 'application/json')
                    .expect(204)
                    .then(res => {
                        expect(res.body).to.be.empty
                    })
            })
        })

        context('when save a web client token from another user', () => {
            it('should return status code 204 and no content', () => {
                return request
                    .put(`/v1/users/${web_push_token.user_id}/push/${PushTokenClientTypes.WEB}/tokens`)
                    .send(web_push_token.toJSON())
                    .set('Content-Type', 'application/json')
                    .expect(204)
                    .then(res => {
                        expect(res.body).to.be.empty
                    })
            })
        })

        context('when save a mobile client token from user that already have a mobile client token', () => {
            it('should return status code 204 and no content', () => {
                return request
                    .put(`/v1/users/${mobile_push_token.user_id}/push/${PushTokenClientTypes.MOBILE}/tokens`)
                    .send(mobile_push_token.toJSON())
                    .set('Content-Type', 'application/json')
                    .expect(204)
                    .then(res => {
                        expect(res.body).to.be.empty
                    })
            })
        })

        context('when save a web client token from user that already have a web client token', () => {
            it('should return status code 204 and no content', () => {
                return request
                    .put(`/v1/users/${mobile_push_token.user_id}/push/${PushTokenClientTypes.WEB}/tokens`)
                    .send(web_push_token.toJSON())
                    .set('Content-Type', 'application/json')
                    .expect(204)
                    .then(res => {
                        expect(res.body).to.be.empty
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should return status code 400 and message from invalid user id', () => {
                return request
                    .put(`/v1/users/123/push/${PushTokenClientTypes.MOBILE}/tokens`)
                    .send(web_push_token.toJSON())
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message', 'Some ID provided does not have a valid format!')
                        expect(res.body).to.have.property('description',
                            'A 24-byte hex ID similar to this: 507f191e810c19729de860ea is expected.')
                    })
            })

            it('should return status code 400 and message from invalid client type', () => {
                const values: Array<string> = Object.values(PushTokenClientTypes)
                return request
                    .put(`/v1/users/${web_push_token.user_id}/push/tablet/tokens`)
                    .send(web_push_token.toJSON())
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message',
                            `${Strings.ERROR_MESSAGE.NOT_MAPPED.replace('{0}', 'client_type')} tablet`)
                        expect(res.body).to.have.property('description',
                            `${Strings.ERROR_MESSAGE.NOT_MAPPED_DESC} ${values.join(', ')}.`)
                    })
            })

            it('should return status code 400 and message from missing parameters', () => {
                return request
                    .put(`/v1/users/${web_push_token.user_id}/push/${web_push_token.client_type}/tokens`)
                    .send({})
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message', 'Required fields were not provided...')
                        expect(res.body).to.have.property('description',
                            'Push Token Validation: token required!')
                    })
            })
        })
    })

    describe('GET /v1/users/:user_id/push/tokens', () => {
        context('when get the web token and mobile token from user', () => {
            it('should return status code 200 and both mobile and web token', () => {
                return request
                    .get(`/v1/users/${mobile_push_token.user_id}/push/tokens`)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        expect(res.body).to.have.property('web_token', web_push_token.token)
                        expect(res.body).to.have.property('mobile_token', mobile_push_token.token)
                    })
            })
        })

        context('when the user already have a type of token', () => {
            it('should return status code 200 and the token that user contains', () => {
                return request
                    .get(`/v1/users/${web_push_token.user_id}/push/tokens`)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        expect(res.body).to.have.property('web_token', web_push_token.token)
                    })
            })
        })

        context('when the user does not have any type of token', () => {
            it('should return status code 404 and message from resource not found', () => {
                return request
                    .get(`/v1/users/${GeneratorMock.generateObjectId()}/push/tokens`)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        expect(res.body).to.have.property('web_token', '')
                        expect(res.body).to.have.property('mobile_token', '')
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should return status code 400 and message from invalid user id', () => {
                return request
                    .get('/v1/users/123/push/tokens')
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

    describe('DELETE /v1/users/:user_id/push/:client_type/tokens', () => {
        context('when remove a user mobile push token', () => {
            it('should return status code 204 and no content', () => {
                return request
                    .delete(`/v1/users/${mobile_push_token.user_id}/push/${PushTokenClientTypes.MOBILE}/tokens`)
                    .set('Content-Type', 'application/json')
                    .expect(204)
                    .then(res => {
                        expect(res.body).to.be.empty
                    })
            })
        })

        context('when remove a user web push token', () => {
            it('should return status code 204 and no content', () => {
                return request
                    .delete(`/v1/users/${mobile_push_token.user_id}/push/${PushTokenClientTypes.WEB}/tokens`)
                    .set('Content-Type', 'application/json')
                    .expect(204)
                    .then(res => {
                        expect(res.body).to.be.empty
                    })
            })
        })

        context('when remove the web push token from nonexistent user', () => {
            it('should return status code 204 and no content', () => {
                return request
                    .delete(`/v1/users/${GeneratorMock.generateObjectId()}/push/${PushTokenClientTypes.WEB}/tokens`)
                    .set('Content-Type', 'application/json')
                    .expect(204)
                    .then(res => {
                        expect(res.body).to.be.empty
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should return status code 400 and message from invalid user id', () => {
                return request
                    .delete(`/v1/users/123/push/${PushTokenClientTypes.MOBILE}/tokens`)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message', 'Some ID provided does not have a valid format!')
                        expect(res.body).to.have.property('description',
                            'A 24-byte hex ID similar to this: 507f191e810c19729de860ea is expected.')
                    })
            })

            it('should return status code 400 and message from invalid client type', () => {
                const values: Array<string> = Object.values(PushTokenClientTypes)
                return request
                    .delete(`/v1/users/${web_push_token.user_id}/push/tablet/tokens`)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message',
                            `${Strings.ERROR_MESSAGE.NOT_MAPPED.replace('{0}', 'client_type')} tablet`)
                        expect(res.body).to.have.property('description',
                            `${Strings.ERROR_MESSAGE.NOT_MAPPED_DESC} ${values.join(', ')}.`)
                    })
            })
        })
    })
})
