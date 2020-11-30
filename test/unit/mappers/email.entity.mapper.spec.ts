import { assert } from 'chai'
import { Email } from '../../../src/application/domain/model/email'
import { EmailEntityMapper } from '../../../src/infrastructure/entity/mapper/email.entity.mapper'
import { EmailEntity } from '../../../src/infrastructure/entity/email.entity'
import { EmailMock } from '../../mocks/models/email.mock'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'

describe('MAPPERS: EmailEntityMapper', () => {
    const emailTokenEntityMapper: EmailEntityMapper = new EmailEntityMapper()

    // Create Email model.
    const email: Email = new EmailMock().generate()

    // Create Email JSON.
    const emailJSON: any = DefaultEntityMock.EMAIL

    describe('transform(item: any)', () => {
        context('when the parameter is of type Email', () => {
            it('should return an EmailEntity from a complete Email', () => {
                const result: EmailEntity = emailTokenEntityMapper.transform(email)

                assert.propertyVal(result, 'id', email.id)
                assert.propertyVal(result.from, 'name', email.from.name)
                assert.propertyVal(result.from, 'email', email.from.email)
                assert.propertyVal(result.reply, 'name', email.reply?.name)
                assert.propertyVal(result.reply, 'email', email.reply?.email)
                assert.propertyVal(result.to[0], 'name', email.to[0].name)
                assert.propertyVal(result.to[0], 'email', email.to[0].email)
                assert.propertyVal(result.cc![0], 'name', email.cc![0].name)
                assert.propertyVal(result.cc![0], 'email', email.cc![0].email)
                assert.propertyVal(result.bcc![0], 'name', email.bcc![0].name)
                assert.propertyVal(result.bcc![0], 'email', email.bcc![0].email)
                assert.propertyVal(result, 'subject', email.subject)
                assert.propertyVal(result, 'text', email.text)
                assert.propertyVal(result, 'html', email.html)
                assert.propertyVal(result.attachments![0], 'filename', email.attachments![0].filename)
                assert.propertyVal(result.attachments![0], 'path', email.attachments![0].path)
                assert.propertyVal(result.attachments![0], 'content_type', email.attachments![0].contentType)
                assert.propertyVal(result, 'user_id', email.userId)
            })

            it('should return an empty EmailEntity from empty Email', () => {
                const result: EmailEntity = emailTokenEntityMapper.transform(new Email())

                assert.isEmpty(result.to)
                assert.isEmpty(result.cc)
                assert.isEmpty(result.bcc)
                assert.isEmpty(result.attachments)
            })
        })

        context('when the parameter is a JSON', () => {
            it('should return an Email from a complete JSON', () => {
                const result: Email = emailTokenEntityMapper.transform(emailJSON)

                assert.propertyVal(result, 'id', emailJSON.id)
                assert.propertyVal(result, 'template', 'default')
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
            })

            it('should return an Email with some attributes equal to undefined from an empty JSON', () => {
                const result: Email = emailTokenEntityMapper.transform({})

                assert.isUndefined(result.id)
                assert.propertyVal(result, 'template', 'default')
            })
        })

        context('when the parameter is undefined', () => {
            it('should return an Email with some attributes equal to undefined from undefined json', () => {
                const result: Email = emailTokenEntityMapper.transform(undefined)

                assert.isUndefined(result.id)
                assert.propertyVal(result, 'template', 'default')
            })
        })
    })
})
