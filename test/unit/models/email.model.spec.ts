import { assert } from 'chai'
import { Email } from '../../../src/application/domain/model/email'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'

describe('MODELS: Email', () => {
    const emailJSON: any = JSON.parse(JSON.stringify(DefaultEntityMock.EMAIL))

    describe('fromJSON()', () => {
        context('when a json is passed', () => {
            it('should return an Email from a complete json', () => {
                const result: Email = new Email().fromJSON(emailJSON)

                assert.propertyVal(result, 'id', emailJSON.id)
                assert.propertyVal(result, 'template', emailJSON.template)
                assert.propertyVal(result.from, 'name', emailJSON.from.name)
                assert.propertyVal(result.from, 'email', emailJSON.from.email)
                assert.propertyVal(result.reply, 'name', emailJSON.reply.name)
                assert.propertyVal(result.reply, 'email', emailJSON.reply.email)
                assert.propertyVal(result.to[0], 'name', emailJSON.to[0].name)
                assert.propertyVal(result.to[0], 'email', emailJSON.to[0].email)
                assert.propertyVal(result.cc![0], 'name', emailJSON.cc[0].name)
                assert.propertyVal(result.cc![0], 'email', emailJSON.cc[0].email)
                assert.propertyVal(result.bcc![0], 'name', emailJSON.bcc[0].name)
                assert.propertyVal(result.bcc![0], 'email', emailJSON.bcc[0].email)
                assert.propertyVal(result, 'subject', emailJSON.subject)
                assert.propertyVal(result, 'text', emailJSON.text)
                assert.propertyVal(result, 'html', emailJSON.html)
                assert.propertyVal(result, 'createdAt', emailJSON.created_at)
                assert.propertyVal(result.attachments![0], 'filename', emailJSON.attachments[0].filename)
                assert.propertyVal(result.attachments![0], 'path', emailJSON.attachments[0].path)
                assert.propertyVal(result.attachments![0], 'contentType', emailJSON.attachments[0].content_type)
                assert.propertyVal(result, 'userId', emailJSON.user_id)
                assert.propertyVal(result, 'link', emailJSON.link)
            })

            it('should return an Email with some attributes equal to undefined from an empty json', () => {
                const result: Email = new Email().fromJSON({})

                assert.isUndefined(result.id)
                assert.propertyVal(result, 'template', 'default')
            })
        })

        context('when the parameter is undefined', () => {
            it('should return an Email with some attributes equal to undefined from an undefined json', () => {
                const result: Email = new Email().fromJSON(undefined)

                assert.isUndefined(result.id)
                assert.propertyVal(result, 'template', 'default')
            })
        })

        context('when the json is a string', () => {
            it('should return an Email from a complete json', () => {
                const result: Email = new Email().fromJSON(JSON.stringify(emailJSON))

                assert.propertyVal(result, 'id', emailJSON.id)
                assert.propertyVal(result, 'template', emailJSON.template)
                assert.propertyVal(result.from, 'name', emailJSON.from.name)
                assert.propertyVal(result.from, 'email', emailJSON.from.email)
                assert.propertyVal(result.reply, 'name', emailJSON.reply.name)
                assert.propertyVal(result.reply, 'email', emailJSON.reply.email)
                assert.propertyVal(result.to[0], 'name', emailJSON.to[0].name)
                assert.propertyVal(result.to[0], 'email', emailJSON.to[0].email)
                assert.propertyVal(result.cc![0], 'name', emailJSON.cc[0].name)
                assert.propertyVal(result.cc![0], 'email', emailJSON.cc[0].email)
                assert.propertyVal(result.bcc![0], 'name', emailJSON.bcc[0].name)
                assert.propertyVal(result.bcc![0], 'email', emailJSON.bcc[0].email)
                assert.propertyVal(result, 'subject', emailJSON.subject)
                assert.propertyVal(result, 'text', emailJSON.text)
                assert.propertyVal(result, 'html', emailJSON.html)
                assert.propertyVal(result, '_createdAt', emailJSON.created_at)
                assert.propertyVal(result.attachments![0], 'filename', emailJSON.attachments[0].filename)
                assert.propertyVal(result.attachments![0], 'path', emailJSON.attachments[0].path)
                assert.propertyVal(result.attachments![0], 'contentType', emailJSON.attachments[0].content_type)
                assert.propertyVal(result, 'userId', emailJSON.user_id)
                assert.propertyVal(result, 'link', emailJSON.link)
            })

            it('should return an Email with some attributes equal to undefined from an empty string', () => {
                const result: Email = new Email().fromJSON(JSON.stringify(''))

                assert.isUndefined(result.id)
                assert.propertyVal(result, 'template', 'default')
            })

            it('should return an Email with some attributes equal to undefined from an invalid string', () => {
                const result: Email = new Email().fromJSON('d52215d412')

                assert.isUndefined(result.id)
                assert.propertyVal(result, 'template', 'default')
            })
        })
    })

    describe('toJSON()', () => {
        context('when toJSON() is executed', () => {
            it('should return a JSON from a complete Email', () => {
                const email: Email = new Email().fromJSON(emailJSON)
                const result: any = email.toJSON()

                assert.propertyVal(result, 'id', emailJSON.id)
                assert.deepPropertyVal(result, 'reply', emailJSON.reply)
                assert.deepPropertyVal(result, 'to', emailJSON.to)
                assert.deepPropertyVal(result, 'cc', emailJSON.cc)
                assert.deepPropertyVal(result, 'bcc', emailJSON.bcc)
                assert.propertyVal(result, 'subject', emailJSON.subject)
                assert.propertyVal(result, 'text', emailJSON.text)
                assert.propertyVal(result, 'html', emailJSON.html)
                assert.deepPropertyVal(result, 'attachments', emailJSON.attachments)
                assert.propertyVal(result, 'created_at', emailJSON.created_at)
            })

            it('should return a JSON with all attributes equal to undefined from an incomplete Email', () => {
                const result: any = new Email().toJSON()

                assert.isUndefined(result.id)
                assert.isUndefined(result.reply)
                assert.isEmpty(result.to)
                assert.isEmpty(result.cc)
                assert.isEmpty(result.bcc)
                assert.isUndefined(result.subject)
                assert.isUndefined(result.text)
                assert.isUndefined(result.html)
                assert.isEmpty(result.attachments)
                assert.isUndefined(result.created_at)
            })
        })
    })
})
