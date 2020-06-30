import { DIContainer } from '../../../src/di/di'
import { Identifier } from '../../../src/di/identifiers'
import { App } from '../../../src/app'
import { expect } from 'chai'
import { Strings } from '../../../src/utils/strings'

const app: App = DIContainer.get(Identifier.APP)
const request = require('supertest')(app.getExpress())

describe('App', () => {
    context('general error handler', () => {
        it('should return status code 404 and an info message about the lack of the route.', async () => {
            const endPoint = '/v1/test/5a62be07d6f33400146c9b61/'
            const resultExpect = {
                code: 404,
                message: Strings.ERROR_MESSAGE.ENDPOINT_NOT_FOUND.replace('{0}', endPoint)
            }
            const result = await request.get(endPoint)
            expect(result.statusCode).to.equal(404)
            expect(result.body).to.deep.equal(resultExpect)
        })

        it('should return status code 400 and an info message about the invalid body', () => {
            const wrongBody: string = 'wrong body'

            return request
                .post('/')
                .send(wrongBody)
                .set('Content-Type', 'application/json')
                .then(res => {
                    expect(res.body.code).to.equal(400)
                    expect(res.body.message).to.equal(Strings.ERROR_MESSAGE.REQUEST_BODY_INVALID)
                    expect(res.body.description).to.equal(Strings.ERROR_MESSAGE.REQUEST_BODY_INVALID_DESC)
                })
        })
    })

    context('', () => {
        it('should return status code 200 for "GET /v1/reference/".', async () => {
            const endPoint = '/v1/reference/'
            const result = await request.get(endPoint)

            expect(result.statusCode).to.equal(200)
        })
    })
})
