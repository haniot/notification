import { IConnectionDB } from '../../../src/infrastructure/port/connection.db.interface'
import { DIContainer } from '../../../src/di/di'
import { Identifier } from '../../../src/di/identifiers'
import { App } from '../../../src/app'
import { Config } from '../../../src/utils/config'
import { DatabaseUtils } from '../../utils/database.utils'
import { PushTokenRepoModel } from '../../../src/infrastructure/database/schema/push.token.schema'
import { Push, PushTypes } from '../../../src/application/domain/model/push'
import { PushMock } from '../../mocks/models/push.mock'
import { PushToken, PushTokenClientTypes } from '../../../src/application/domain/model/push.token'
import { PushTokenMock } from '../../mocks/models/push.token.mock'
import { PushRepoModel } from '../../../src/infrastructure/database/schema/push.schema'
import { expect } from 'chai'
import { GeneratorMock } from '../../mocks/generator.mock'
import { Strings } from '../../../src/utils/strings'
import { ChoiceTypes } from '../../../src/application/domain/utils/choice.types'
import { IPushRepository } from '../../../src/application/port/push.repository.interface'
import { Query } from '../../../src/infrastructure/repository/query/query'

const dbConnection: IConnectionDB = DIContainer.get(Identifier.MONGODB_CONNECTION)
const app: App = DIContainer.get(Identifier.APP)
const request = require('supertest')(app.getExpress())
const pushRepository: IPushRepository = DIContainer.get(Identifier.PUSH_REPOSITORY)

describe('Routes: push', () => {
    const direct_push: Push = new PushMock().generate(PushTypes.DIRECT)
    const push_token: PushToken = new PushTokenMock().generate(PushTokenClientTypes.MOBILE)

    before(async () => {
            try {
                const mongoConfigs = Config.getMongoConfig()
                await dbConnection.tryConnect(mongoConfigs.uri, mongoConfigs.options)
                await DatabaseUtils.deleteMany(PushTokenRepoModel)
                await DatabaseUtils.deleteMany(PushRepoModel)
            } catch (err) {
                throw new Error('Failure on push test: ' + err.message)
            }
        }
    )

    after(async () => {
        try {
            await DatabaseUtils.deleteMany(PushTokenRepoModel)
            await DatabaseUtils.deleteMany(PushRepoModel)
            await dbConnection.dispose()
        } catch (err) {
            throw new Error('Failure on push test: ' + err.message)
        }
    })

    describe('POST /v1/push', () => {
        context('when there are validation errors', () => {
            before(async () => {
                try {
                    await DatabaseUtils.deleteMany(PushTokenRepoModel)
                    await DatabaseUtils.deleteMany(PushRepoModel)
                    const token: any = await DatabaseUtils.create(PushTokenRepoModel, push_token.toJSON())
                    direct_push.to = [token.user_id]
                } catch (err) {
                    throw new Error('Failure on push test: ' + err.message)
                }
            })

            context('when the Push is incomplete', () => {
                it('should return status code 400 and info message about missing parameters (message.type, message.pt, message.eng)',
                    () => {
                        const body = {
                            type: direct_push.type,
                            keep_it: direct_push.keep_it,
                            to: direct_push.to,
                            message: {},
                            user_id: direct_push.user_id
                        }

                        return request
                            .post('/v1/push')
                            .send(body)
                            .set('Content-Type', 'application/json')
                            .expect(400)
                            .then(err => {
                                expect(err.body.message).to.eql(Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS)
                                expect(err.body.description).to.eql(Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS_DESC
                                    .replace('{0}', 'message.type, message.pt, message.eng'))
                            })
                    })

                it('should return status code 400 and info message about missing parameters (message.pt.title)', () => {
                    const body = {
                        type: direct_push.type,
                        keep_it: direct_push.keep_it,
                        to: direct_push.to,
                        message: {
                            type: direct_push.message?.type,
                            pt: {
                                text: direct_push.message?.pt.text
                            },
                            eng: direct_push.message?.eng
                        },
                        user_id: direct_push.user_id
                    }

                    return request
                        .post('/v1/push')
                        .send(body)
                        .set('Content-Type', 'application/json')
                        .expect(400)
                        .then(err => {
                            expect(err.body.message).to.eql(Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS)
                            expect(err.body.description).to.eql(Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS_DESC
                                .replace('{0}', 'message.pt.title'))
                        })
                })

                it('should return status code 400 and info message about missing parameters (message.pt.text)', () => {
                    const body = {
                        type: direct_push.type,
                        keep_it: direct_push.keep_it,
                        to: direct_push.to,
                        message: {
                            type: direct_push.message?.type,
                            pt: {
                                title: direct_push.message?.pt.title
                            },
                            eng: direct_push.message?.eng
                        },
                        user_id: direct_push.user_id
                    }

                    return request
                        .post('/v1/push')
                        .send(body)
                        .set('Content-Type', 'application/json')
                        .expect(400)
                        .then(err => {
                            expect(err.body.message).to.eql(Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS)
                            expect(err.body.description).to.eql(Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS_DESC
                                .replace('{0}', 'message.pt.text'))
                        })
                })

                it('should return status code 400 and info message about missing all parameters', () => {
                    return request
                        .post('/v1/push')
                        .send({})
                        .set('Content-Type', 'application/json')
                        .expect(400)
                        .then(err => {
                            expect(err.body.message).to.eql(Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS)
                            expect(err.body.description).to.eql(Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS_DESC
                                .replace('{0}', 'type, keep_it, to, message, user_id'))
                        })
                })
            })

            context('when the Push type is invalid', () => {
                const pushTypes: Array<string> = Object.values(PushTypes)

                it('should return status code 400 and info message about unmapped type', () => {
                    const body = {
                        type: 'invalidPushType',
                        keep_it: direct_push.keep_it,
                        to: direct_push.to,
                        message: direct_push.message,
                        user_id: direct_push.user_id
                    }

                    return request
                        .post('/v1/push')
                        .send(body)
                        .set('Content-Type', 'application/json')
                        .expect(400)
                        .then(err => {
                            expect(err.body.message).to.eql(`${Strings.ERROR_MESSAGE.VALIDATE.NOT_MAPPED
                                .replace('{0}', 'type')} invalidPushType`)
                            expect(err.body.description)
                                .to.eql(`${Strings.ERROR_MESSAGE.VALIDATE.NOT_MAPPED_DESC} ${pushTypes.join(', ')}.`)
                        })
                })
            })

            context('when the Push keep_it is invalid', () => {
                const choiceTypes: Array<string> = Object.values(ChoiceTypes)

                it('should return status code 400 and info message about unmapped keep_it', () => {
                    const body = {
                        type: direct_push.type,
                        keep_it: 'invalidChoiceType',
                        to: direct_push.to,
                        message: direct_push.message,
                        user_id: direct_push.user_id
                    }

                    return request
                        .post('/v1/push')
                        .send(body)
                        .set('Content-Type', 'application/json')
                        .expect(400)
                        .then(err => {
                            expect(err.body.message).to.eql(`${Strings.ERROR_MESSAGE.VALIDATE.NOT_MAPPED
                                .replace('{0}', 'keep_it')} invalidChoiceType`)
                            expect(err.body.description)
                                .to.eql(`${Strings.ERROR_MESSAGE.VALIDATE.NOT_MAPPED_DESC} ${choiceTypes.join(', ')}.`)
                        })
                })
            })

            context('when the Push to is invalid', () => {
                it('should return status code 400 and info message about empty to', () => {
                    const body = {
                        type: direct_push.type,
                        keep_it: direct_push.keep_it,
                        to: [],
                        message: direct_push.message,
                        user_id: direct_push.user_id
                    }

                    return request
                        .post('/v1/push')
                        .send(body)
                        .set('Content-Type', 'application/json')
                        .expect(400)
                        .then(err => {
                            expect(err.body.message).to.eql(Strings.ERROR_MESSAGE.VALIDATE.AT_LEAST_ONE_RECIPIENT)
                            expect(err.body.description).to.eql(Strings.ERROR_MESSAGE.VALIDATE.AT_LEAST_ONE_RECIPIENT_DESC)
                        })
                })

                it('should return status code 400 and info message about an invalid id in \'to\' array', () => {
                    const body = {
                        type: direct_push.type,
                        keep_it: direct_push.keep_it,
                        to: ['5f5a3c5accefbde6e36d1b31', '123', '4e3b3c5accefbde6e45d2c23'],
                        message: direct_push.message,
                        user_id: direct_push.user_id
                    }

                    return request
                        .post('/v1/push')
                        .send(body)
                        .set('Content-Type', 'application/json')
                        .expect(400)
                        .then(err => {
                            expect(err.body.message).to.eql(Strings.ERROR_MESSAGE.VALIDATE.UUID_NOT_VALID_FORMAT)
                            expect(err.body.description).to.eql(Strings.ERROR_MESSAGE.VALIDATE.UUID_NOT_VALID_FORMAT_DESC)
                        })
                })
            })

            context('when the Push user_id is invalid', () => {
                it('should return status code 400 and info message about invalid user_id', () => {
                    const body = {
                        type: direct_push.type,
                        keep_it: direct_push.keep_it,
                        to: direct_push.to,
                        message: direct_push.message,
                        user_id: '123'
                    }

                    return request
                        .post('/v1/push')
                        .send(body)
                        .set('Content-Type', 'application/json')
                        .expect(400)
                        .then(err => {
                            expect(err.body.message).to.eql(Strings.USER.PARAM_ID_NOT_VALID_FORMAT)
                            expect(err.body.description).to.eql(Strings.ERROR_MESSAGE.VALIDATE.UUID_NOT_VALID_FORMAT_DESC)
                        })
                })
            })

            context('when some user do not have saved push tokens', () => {
                it('should return status code 400 and info message about the user not having saved push tokens', () => {
                    const random_id: string = GeneratorMock.generateObjectId()
                    return request
                        .post('/v1/push')
                        .send({ ...direct_push.toJSON(), to: [random_id] })
                        .set('Content-Type', 'application/json')
                        .expect(400)
                        .then(err => {
                            expect(err.body.message).to.eql(Strings.ERROR_MESSAGE.VALIDATE.USER_HAS_NO_PUSH_TOKEN
                                .replace('{0}', random_id))
                            expect(err.body.description).to.eql(Strings.ERROR_MESSAGE.VALIDATE.USER_HAS_NO_PUSH_TOKEN_DESC)
                        })
                })
            })
        })
    })

    describe('POST /v1/push/:push_id/read', () => {
        context('when want signalize that the push has been read', () => {
            let result

            before(async () => {
                try {
                    await DatabaseUtils.deleteMany(PushTokenRepoModel)
                    await DatabaseUtils.deleteMany(PushRepoModel)
                    const token: any = await DatabaseUtils.create(PushTokenRepoModel, push_token.toJSON())
                    direct_push.to = [token.user_id]
                    result = await DatabaseUtils.create(PushRepoModel, direct_push.toJSON())
                } catch (err) {
                    throw new Error('Failure on push test: ' + err.message)
                }
            })
            it('should return status code 204 and no content', () => {
                return request
                    .post(`/v1/push/${result.id}/read`)
                    .set('Content-Type', 'application/json')
                    .expect(204)
                    .then(async res => {
                        expect(res.body).to.be.empty
                        const pushRepo: Push | undefined =
                            await pushRepository.findOne(new Query().fromJSON({ filters: { _id: result.id } }))
                        expect(pushRepo?.is_read).to.eql(ChoiceTypes.YES)
                    })
            })
        })
        context('when the push does not exists', () => {
            before(async () => {
                try {
                    await DatabaseUtils.deleteMany(PushTokenRepoModel)
                    await DatabaseUtils.deleteMany(PushRepoModel)
                } catch (err) {
                    throw new Error('Failure on push test: ' + err.message)
                }
            })
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

        context('when there are validation errors', () => {
            it('should return status code 400 and info message about invalid push id', () => {
                return request
                    .post('/v1/push/123/read')
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(err => {
                        expect(err.body.message).to.eql(Strings.PUSH.PARAM_ID_NOT_VALID_FORMAT)
                        expect(err.body.description).to.eql(Strings.ERROR_MESSAGE.VALIDATE.UUID_NOT_VALID_FORMAT_DESC)
                    })
            })
        })
    })

    describe('DELETE /v1/push/:push_id', () => {
        context('when delete a saved push', () => {
            let result

            before(async () => {
                try {
                    await DatabaseUtils.deleteMany(PushTokenRepoModel)
                    await DatabaseUtils.deleteMany(PushRepoModel)
                    const token: any = await DatabaseUtils.create(PushTokenRepoModel, push_token.toJSON())
                    direct_push.to = [token.user_id]
                    result = await DatabaseUtils.create(PushRepoModel, direct_push.toJSON())
                } catch (err) {
                    throw new Error('Failure on push test: ' + err.message)
                }
            })

            it('should return status code 204 and no content', () => {
                return request
                    .delete(`/v1/push/${result.id}`)
                    .set('Content-Type', 'application/json')
                    .expect(204)
                    .then(async res => {
                        expect(res.body).to.be.empty
                        const countPush = await pushRepository.count(new Query())
                        expect(countPush).to.eql(0)
                    })
            })
        })

        context('when the push is already removed', () => {
            before(async () => {
                try {
                    await DatabaseUtils.deleteMany(PushTokenRepoModel)
                    await DatabaseUtils.deleteMany(PushRepoModel)
                } catch (err) {
                    throw new Error('Failure on push test: ' + err.message)
                }
            })
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
            it('should return status code 400 and info message about invalid push id', () => {
                return request
                    .delete('/v1/push/123')
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(err => {
                        expect(err.body.message).to.eql(Strings.PUSH.PARAM_ID_NOT_VALID_FORMAT)
                        expect(err.body.description).to.eql(Strings.ERROR_MESSAGE.VALIDATE.UUID_NOT_VALID_FORMAT_DESC)
                    })
            })
        })
    })
})
