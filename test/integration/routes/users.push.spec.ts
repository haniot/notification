import { IConnectionDB } from '../../../src/infrastructure/port/connection.db.interface'
import { DIContainer } from '../../../src/di/di'
import { Identifier } from '../../../src/di/identifiers'
import { App } from '../../../src/app'
import { Config } from '../../../src/utils/config'
import { DatabaseUtils } from '../../utils/database.utils'
import { PushTypes, Push } from '../../../src/application/domain/model/push'
import { PushMock } from '../../mocks/models/push.mock'
import { PushRepoModel } from '../../../src/infrastructure/database/schema/push.schema'
import { expect } from 'chai'
import { GeneratorMock } from '../../mocks/generator.mock'
import { Strings } from '../../../src/utils/strings'

const dbConnection: IConnectionDB = DIContainer.get(Identifier.MONGODB_CONNECTION)
const app: App = DIContainer.get(Identifier.APP)
const request = require('supertest')(app.getExpress())

describe('Routes: users.push', () => {
    const direct_push: Push = new PushMock().generate(PushTypes.DIRECT, [GeneratorMock.generateObjectId()])

    before(async () => {
            try {
                const mongoConfigs = Config.getMongoConfig()
                await dbConnection.tryConnect(mongoConfigs.uri, mongoConfigs.options)
                await DatabaseUtils.deleteMany(PushRepoModel)
            } catch (err: any) {
                throw new Error('Failure on users.push test: ' + err.message)
            }
        }
    )

    after(async () => {
        try {
            await DatabaseUtils.deleteMany(PushRepoModel)
            await dbConnection.dispose()
        } catch (err: any) {
            throw new Error('Failure on users.push test: ' + err.message)
        }
    })

    describe('GET /v1/users/:user_id/push', () => {
        context('when get the saved push notifications from user', () => {
            before(async () => {
                try {
                    await DatabaseUtils.deleteMany(PushRepoModel, {})
                    await DatabaseUtils.create(PushRepoModel, direct_push.toJSON())
                } catch (err: any) {
                    throw new Error('Failure on users.push test: ' + err.message)
                }
            })
            it('should return status code 200 and a list of push notifications', () => {
                return request
                    .get(`/v1/users/${direct_push.to![0]}/push`)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        expect(res.body.length).to.be.eql(1)
                        expect(res.body[0]).to.have.property('id')
                        expect(res.body[0].type).to.be.eql(direct_push.type)
                        expect(res.body[0].is_read).to.be.eql(direct_push.is_read)
                        expect(res.body[0].to).to.be.eql(direct_push.to)
                        expect(res.body[0].message.type).to.be.eql(direct_push.message?.type)
                        expect(res.body[0].message.pt).to.be.eql(direct_push.message?.pt)
                        expect(res.body[0].message.en).to.be.eql(direct_push.message?.en)
                    })
            })
        })

        context('when the user does not have push notifications', () => {
            before(async () => {
                try {
                    await DatabaseUtils.deleteMany(PushRepoModel, {})
                } catch (err: any) {
                    throw new Error('Failure on users.push test: ' + err.message)
                }
            })
            it('should return status code 200 and an empty list', () => {
                return request
                    .get(`/v1/users/${direct_push.to![0]}/push`)
                    .set('Content-Type', 'application/json')
                    .expect(200)
                    .then(res => {
                        expect(res.body.length).to.be.eql(0)
                    })
            })
        })

        context('when there are validation errors', () => {
            it('should return status code 400 and info message about invalid user id', () => {
                return request
                    .get(`/v1/users/123/push`)
                    .set('Content-Type', 'application/json')
                    .expect(400)
                    .then(err => {
                        expect(err.body.message).to.eql(Strings.USER.PARAM_ID_NOT_VALID_FORMAT)
                        expect(err.body.description).to.eql(Strings.ERROR_MESSAGE.VALIDATE.UUID_NOT_VALID_FORMAT_DESC)
                    })
            })
        })
    })
})
