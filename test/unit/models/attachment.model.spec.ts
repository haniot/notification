import { assert } from 'chai'
import { Attachment } from '../../../src/application/domain/model/attachment'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'

describe('MODELS: Attachment', () => {
    const attachmentJSON: any = JSON.parse(JSON.stringify(DefaultEntityMock.ATTACHMENT))

    describe('fromJSON()', () => {
        context('when a json is passed', () => {
            it('should return an Attachment from a complete json', () => {
                const result: Attachment = new Attachment().fromJSON(attachmentJSON)

                assert.propertyVal(result, 'filename', attachmentJSON.filename)
                assert.propertyVal(result, 'path', attachmentJSON.path)
                assert.propertyVal(result, 'contentType', attachmentJSON.content_type)
            })

            it('should return an Attachment with some attributes equal to undefined from an empty json', () => {
                const result: Attachment = new Attachment().fromJSON({})

                assert.isEmpty(result)
            })
        })

        context('when the parameter is undefined', () => {
            it('should return an Attachment with some attributes equal to undefined from an undefined json', () => {
                const result: Attachment = new Attachment().fromJSON(undefined)

                assert.isEmpty(result)
            })
        })

        context('when the json is a string', () => {
            it('should return an Attachment from a complete json', () => {
                const result: Attachment = new Attachment().fromJSON(JSON.stringify(attachmentJSON))

                assert.propertyVal(result, 'filename', attachmentJSON.filename)
                assert.propertyVal(result, 'path', attachmentJSON.path)
                assert.propertyVal(result, 'contentType', attachmentJSON.content_type)
            })

            it('should return an Attachment with some attributes equal to undefined from an empty string', () => {
                const result: Attachment = new Attachment().fromJSON(JSON.stringify(''))

                assert.isEmpty(result)
            })

            it('should return an Attachment with some attributes equal to undefined from an invalid string', () => {
                const result: Attachment = new Attachment().fromJSON('d52215d412')

                assert.isEmpty(result)
            })
        })
    })

    describe('toJSON()', () => {
        context('when toJSON() is executed', () => {
            it('should return a JSON from a complete Attachment', () => {
                const attachment: Attachment = new Attachment().fromJSON(attachmentJSON)
                const result: any = attachment.toJSON()

                assert.propertyVal(result, 'filename', attachmentJSON.filename)
                assert.propertyVal(result, 'path', attachmentJSON.path)
                assert.propertyVal(result, 'content_type', attachmentJSON.content_type)
            })

            it('should return a JSON with all attributes equal to undefined from an incomplete Attachment', () => {
                const result: any = new Attachment().toJSON()

                assert.isUndefined(result.filename)
                assert.isUndefined(result.path)
                assert.isUndefined(result.content_type)
            })
        })
    })
})
