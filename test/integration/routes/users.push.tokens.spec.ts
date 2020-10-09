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
import { IPushTokenRepository } from '../../../src/application/port/push.token.repository.interface'
import { Query } from '../../../src/infrastructure/repository/query/query'

const dbConnection: IConnectionDB = DIContainer.get(Identifier.MONGODB_CONNECTION)
const app: App = DIContainer.get(Identifier.APP)
const request = require('supertest')(app.getExpress())
const pushTokenRepository: IPushTokenRepository = DIContainer.get(Identifier.PUSH_TOKEN_REPOSITORY)

describe('Routes: users.push.tokens', () => {
    const web_push_token: PushToken = new PushTokenMock().generate(PushTokenClientTypes.WEB)
    const mobile_push_token: PushToken = new PushTokenMock().generate(PushTokenClientTypes.MOBILE)
    mobile_push_token.user_id = web_push_token.user_id

    before(async () => {
            try {
                const mongoConfigs = Config.getMongoConfig()
                await dbConnection.tryConnect(mongoConfigs.uri, mongoConfigs.options)
                await DatabaseUtils.deleteMany(PushTokenRepoModel, {})
            } catch (err) {
                throw new Error('Failure on users.push.tokens test: ' + err.message)
            }
        }
    )

    after(async () => {
        try {
            await DatabaseUtils.deleteMany(PushTokenRepoModel, {})
            await dbConnection.dispose()
        } catch (err) {
            throw new Error('Failure on users.push.tokens test: ' + err.message)
        }
    })

    describe('PUT /v1/users/:user_id/push/:client_type/tokens', () => {
        context('when save a client token successfully', () => {
            before(async () => {
                try {
                    await DatabaseUtils.deleteMany(PushTokenRepoModel, {})
                } catch (err) {
                    throw new Error('Failure on users.push.tokens test: ' + err.message)
                }
            })
            it('should return status code 204 and no content for web client token', () => {
                return request
                    .put(`/v1/users/${web_push_token.user_id}/push/${PushTokenClientTypes.WEB}/tokens`)
                    .send({ token: web_push_token.token })
                    .set('Content-Type', 'application/json')
                    .expect(204)
                    .then(res => {
                        expect(res.body).to.be.empty
                    })
            })

            it('should return status code 204 and no content for mobile client token', () => {
                return request
                    .put(`/v1/users/${mobile_push_token.user_id}/push/${PushTokenClientTypes.MOBILE}/tokens`)
                    .send({ token: mobile_push_token.token })
                    .set('Content-Type', 'application/json')
                    .expect(204)
                    .then(res => {
                        expect(res.body).to.be.empty
                    })
            })
        })

        context('when save a mobile client token for an user who already has a web client token.', () => {
            before(async () => {
                try {
                    await DatabaseUtils.deleteMany(PushTokenRepoModel, {})
                    await DatabaseUtils.create(PushTokenRepoModel, web_push_token.toJSON())
                } catch (err) {
                    throw new Error('Failure on users.push.tokens test: ' + err.message)
                }
            })
            it('should return status code 204 and no content', () => {
                return request
                    .put(`/v1/users/${web_push_token.user_id}/push/${PushTokenClientTypes.MOBILE}/tokens`)
                    .send({ token: mobile_push_token.token })
                    .set('Content-Type', 'application/json')
                    .expect(204)
                    .then(res => {
                        expect(res.body).to.be.empty
                    })
            })
        })

        context('when save a web client token for an user who already has a mobile client token.', () => {
            before(async () => {
                try {
                    await DatabaseUtils.deleteMany(PushTokenRepoModel, {})
                    await DatabaseUtils.create(PushTokenRepoModel, mobile_push_token.toJSON())
                } catch (err) {
                    throw new Error('Failure on users.push.tokens test: ' + err.message)
                }
            })
            it('should return status code 204 and no content', () => {
                return request
                    .put(`/v1/users/${mobile_push_token.user_id}/push/${PushTokenClientTypes.WEB}/tokens`)
                    .send({ token: web_push_token.token })
                    .set('Content-Type', 'application/json')
                    .expect(204)
                    .then(res => {
                        expect(res.body).to.be.empty
                    })
            })
        })

        context('when save a web client token for an user that already have a web client token', () => {
            before(async () => {
                try {
                    await DatabaseUtils.deleteMany(PushTokenRepoModel, {})
                    await DatabaseUtils.create(PushTokenRepoModel, web_push_token.toJSON())
                } catch (err) {
                    throw new Error('Failure on users.push.tokens test: ' + err.message)
                }
            })
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

        context('when save a mobile client token for an user that already have a mobile client token', () => {
            before(async () => {
                try {
                    await DatabaseUtils.deleteMany(PushTokenRepoModel, {})
                    await DatabaseUtils.create(PushTokenRepoModel, mobile_push_token.toJSON())
                } catch (err) {
                    throw new Error('Failure on users.push.tokens test: ' + err.message)
                }
            })
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

        context('when there are validation errors', () => {
            it('should return status code 400 and message from missing parameters', () => {
                return request
                    .put(`/v1/users/${web_push_token.user_id}/push/${web_push_token.client_type}/tokens`)
                    .send({})
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message', Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS)
                        expect(res.body).to.have.property('description', Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS_DESC
                            .replace('{0}', 'token'))
                    })
            })

            it('should return status code 400 and message from invalid user id', () => {
                return request
                    .put(`/v1/users/123/push/${PushTokenClientTypes.MOBILE}/tokens`)
                    .send(web_push_token.toJSON())
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message', Strings.USER.PARAM_ID_NOT_VALID_FORMAT)
                        expect(res.body).to.have.property('description',
                            Strings.ERROR_MESSAGE.VALIDATE.UUID_NOT_VALID_FORMAT_DESC)
                    })
            })

            it('should return status code 400 and message from invalid client type', () => {
                const pushTokenClientTypes: Array<string> = Object.values(PushTokenClientTypes)
                return request
                    .put(`/v1/users/${web_push_token.user_id}/push/tablet/tokens`)
                    .send(web_push_token.toJSON())
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message',
                            `${Strings.ERROR_MESSAGE.VALIDATE.NOT_MAPPED.replace('{0}', 'client_type')} tablet`)
                        expect(res.body).to.have.property('description',
                            `${Strings.ERROR_MESSAGE.VALIDATE.NOT_MAPPED_DESC} ${pushTokenClientTypes.join(', ')}.`)
                    })
            })
        })
    })

    describe('GET /v1/users/:user_id/push/tokens', () => {
        context('when get the web and mobile tokens from user', () => {
            before(async () => {
                try {
                    await DatabaseUtils.deleteMany(PushTokenRepoModel, {})
                    await DatabaseUtils.create(PushTokenRepoModel, web_push_token.toJSON())
                    await DatabaseUtils.create(PushTokenRepoModel, mobile_push_token.toJSON())
                } catch (err) {
                    throw new Error('Failure on users.push.tokens test: ' + err.message)
                }
            })
            it('should return status code 200 and both web and mobile token', () => {
                return request
                    .get(`/v1/users/${web_push_token.user_id}/push/tokens`)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        expect(res.body).to.have.property('web_token', web_push_token.token)
                        expect(res.body).to.have.property('mobile_token', mobile_push_token.token)
                    })
            })
        })

        context('when the user has only a web client token', () => {
            before(async () => {
                try {
                    await DatabaseUtils.deleteMany(PushTokenRepoModel, {})
                    await DatabaseUtils.create(PushTokenRepoModel, web_push_token.toJSON())
                } catch (err) {
                    throw new Error('Failure on users.push.tokens test: ' + err.message)
                }
            })
            it('should return status code 200 and the web client token', () => {
                return request
                    .get(`/v1/users/${web_push_token.user_id}/push/tokens`)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        expect(res.body).to.have.property('web_token', web_push_token.token)
                        expect(res.body).to.have.property('mobile_token', '')
                    })
            })
        })

        context('when the user has only a mobile client token', () => {
            before(async () => {
                try {
                    await DatabaseUtils.deleteMany(PushTokenRepoModel, {})
                    await DatabaseUtils.create(PushTokenRepoModel, mobile_push_token.toJSON())
                } catch (err) {
                    throw new Error('Failure on users.push.tokens test: ' + err.message)
                }
            })
            it('should return status code 200 and the mobile client token', () => {
                return request
                    .get(`/v1/users/${mobile_push_token.user_id}/push/tokens`)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        expect(res.body).to.have.property('web_token', '')
                        expect(res.body).to.have.property('mobile_token', mobile_push_token.token)
                    })
            })
        })

        context('when the user does not have any type of token', () => {
            before(async () => {
                try {
                    await DatabaseUtils.deleteMany(PushTokenRepoModel, {})
                } catch (err) {
                    throw new Error('Failure on users.push.tokens test: ' + err.message)
                }
            })
            it('should return status code 200 and an object with empty web_token and mobile_token.', () => {
                return request
                    .get(`/v1/users/${web_push_token.user_id}/push/tokens`)
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
                        expect(res.body).to.have.property('message', Strings.USER.PARAM_ID_NOT_VALID_FORMAT)
                        expect(res.body).to.have.property('description',
                            Strings.ERROR_MESSAGE.VALIDATE.UUID_NOT_VALID_FORMAT_DESC)
                    })
            })
        })
    })

    describe('DELETE /v1/users/:user_id/push/:client_type/tokens', () => {
        context('when remove a user push token successfully', () => {
            before(async () => {
                try {
                    await DatabaseUtils.deleteMany(PushTokenRepoModel, {})
                    await DatabaseUtils.create(PushTokenRepoModel, web_push_token.toJSON())
                    await DatabaseUtils.create(PushTokenRepoModel, mobile_push_token.toJSON())
                } catch (err) {
                    throw new Error('Failure on users.push.tokens test: ' + err.message)
                }
            })
            it('should return status code 204 and no content for web client token', () => {
                return request
                    .delete(`/v1/users/${web_push_token.user_id}/push/${PushTokenClientTypes.WEB}/tokens`)
                    .set('Content-Type', 'application/json')
                    .expect(204)
                    .then(async res => {
                        expect(res.body).to.be.empty
                        const countWebPushToken = await pushTokenRepository.count(new Query().fromJSON(
                            { filters: { user_id: web_push_token.user_id, client_type: web_push_token.client_type } }
                            ))
                        expect(countWebPushToken).to.eql(0)
                    })
            })

            it('should return status code 204 and no content for mobile client token', () => {
                return request
                    .delete(`/v1/users/${mobile_push_token.user_id}/push/${PushTokenClientTypes.MOBILE}/tokens`)
                    .set('Content-Type', 'application/json')
                    .expect(204)
                    .then(async res => {
                        expect(res.body).to.be.empty
                        const countMobilePushToken = await pushTokenRepository.count(new Query().fromJSON(
                            { filters: { user_id: mobile_push_token.user_id, client_type: mobile_push_token.client_type } }
                        ))
                        expect(countMobilePushToken).to.eql(0)
                    })
            })
        })

        context('when remove a push token from non-existent user', () => {
            before(async () => {
                try {
                    await DatabaseUtils.deleteMany(PushTokenRepoModel, {})
                } catch (err) {
                    throw new Error('Failure on users.push.tokens test: ' + err.message)
                }
            })
            it('should return status code 204 and no content', () => {
                return request
                    .delete(`/v1/users/${web_push_token.user_id}/push/${PushTokenClientTypes.WEB}/tokens`)
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
                        expect(res.body).to.have.property('message', Strings.USER.PARAM_ID_NOT_VALID_FORMAT)
                        expect(res.body).to.have.property('description',
                            Strings.ERROR_MESSAGE.VALIDATE.UUID_NOT_VALID_FORMAT_DESC)
                    })
            })

            it('should return status code 400 and message from invalid client type', () => {
                const pushTokenClientTypes: Array<string> = Object.values(PushTokenClientTypes)
                return request
                    .delete(`/v1/users/${web_push_token.user_id}/push/tablet/tokens`)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(res => {
                        expect(res.body).to.have.property('message',
                            `${Strings.ERROR_MESSAGE.VALIDATE.NOT_MAPPED.replace('{0}', 'client_type')} tablet`)
                        expect(res.body).to.have.property('description',
                            `${Strings.ERROR_MESSAGE.VALIDATE.NOT_MAPPED_DESC} ${pushTokenClientTypes.join(', ')}.`)
                    })
            })
        })
    })
})
