import { DIContainer } from '../../../src/di/di'
import { Identifier } from '../../../src/di/identifiers'
import { App } from '../../../src/app'
import { expect } from 'chai'
import { Strings } from '../../../src/utils/strings'
import { EmailTemplateResources, EmailTemplateTypes } from '../../../src/application/domain/model/email.template'
import { FileFormatType } from '../../../src/application/domain/model/file'

const app: App = DIContainer.get(Identifier.APP)
const request = require('supertest')(app.getExpress())

describe('Routes: emails.templates', () => {
    describe('GET /v1/emails/templates/:type/:resource', () => {
        // context('when get an email template successfully', () => {
        //     it('should return status code 200 and the html file template of the welcome email', () => {
        //         return request
        //             .get(`/v1/emails/templates/${EmailTemplateTypes.WELCOME}/${EmailTemplateResources.HTML}`)
        //             .set('Content-Type', FileFormatType.OCTET_STREAM)
        //             .expect(200)
        //             .then(res => {
        //                 expect(res.body).to.be.an.instanceof(Buffer)
        //             })
        //     })
        //
        //     it('should return status code 200 and the subject file template of the welcome email', () => {
        //         return request
        //             .get(`/v1/emails/templates/${EmailTemplateTypes.WELCOME}/${EmailTemplateResources.SUBJECT}`)
        //             .set('Content-Type', FileFormatType.OCTET_STREAM)
        //             .expect(200)
        //             .then(res => {
        //                 expect(res.body).to.be.an.instanceof(Buffer)
        //             })
        //     })
        //
        //     it('should return status code 200 and the text file template of the welcome email', () => {
        //         return request
        //             .get(`/v1/emails/templates/${EmailTemplateTypes.WELCOME}/${EmailTemplateResources.TEXT}`)
        //             .set('Content-Type', FileFormatType.OCTET_STREAM)
        //             .expect(200)
        //             .then(res => {
        //                 expect(res.body).to.be.an.instanceof(Buffer)
        //             })
        //     })
        //
        //     it('should return status code 200 and the html file template of the password reset email', () => {
        //         return request
        //             .get(`/v1/emails/templates/${EmailTemplateTypes.RESET_PASSWORD}/${EmailTemplateResources.HTML}`)
        //             .set('Content-Type', FileFormatType.OCTET_STREAM)
        //             .expect(200)
        //             .then(res => {
        //                 expect(res.body).to.be.an.instanceof(Buffer)
        //             })
        //     })
        //
        //     it('should return status code 200 and the subject file template of the password reset email', () => {
        //         return request
        //             .get(`/v1/emails/templates/${EmailTemplateTypes.RESET_PASSWORD}/${EmailTemplateResources.SUBJECT}`)
        //             .set('Content-Type', FileFormatType.OCTET_STREAM)
        //             .expect(200)
        //             .then(res => {
        //                 expect(res.body).to.be.an.instanceof(Buffer)
        //             })
        //     })
        //
        //     it('should return status code 200 and the text file template of the password reset email', () => {
        //         return request
        //             .get(`/v1/emails/templates/${EmailTemplateTypes.RESET_PASSWORD}/${EmailTemplateResources.TEXT}`)
        //             .set('Content-Type', FileFormatType.OCTET_STREAM)
        //             .expect(200)
        //             .then(res => {
        //                 expect(res.body).to.be.an.instanceof(Buffer)
        //             })
        //     })
        //
        //     it('should return status code 200 and the html file template of the password update email', () => {
        //         return request
        //             .get(`/v1/emails/templates/${EmailTemplateTypes.UPDATED_PASSWORD}/${EmailTemplateResources.HTML}`)
        //             .set('Content-Type', FileFormatType.OCTET_STREAM)
        //             .expect(200)
        //             .then(res => {
        //                 expect(res.body).to.be.an.instanceof(Buffer)
        //             })
        //     })
        //
        //     it('should return status code 200 and the subject file template of the password update email', () => {
        //         return request
        //             .get(`/v1/emails/templates/${EmailTemplateTypes.UPDATED_PASSWORD}/${EmailTemplateResources.SUBJECT}`)
        //             .set('Content-Type', FileFormatType.OCTET_STREAM)
        //             .expect(200)
        //             .then(res => {
        //                 expect(res.body).to.be.an.instanceof(Buffer)
        //             })
        //     })
        //
        //     it('should return status code 200 and the text file template of the password update email', () => {
        //         return request
        //             .get(`/v1/emails/templates/${EmailTemplateTypes.UPDATED_PASSWORD}/${EmailTemplateResources.TEXT}`)
        //             .set('Content-Type', FileFormatType.OCTET_STREAM)
        //             .expect(200)
        //             .then(res => {
        //                 expect(res.body).to.be.an.instanceof(Buffer)
        //             })
        //     })
        //
        //     it('should return status code 200 and the html file template of the pilot study email', () => {
        //         return request
        //             .get(`/v1/emails/templates/${EmailTemplateTypes.PILOT_STUDY_DATA}/${EmailTemplateResources.HTML}`)
        //             .set('Content-Type', FileFormatType.OCTET_STREAM)
        //             .expect(200)
        //             .then(res => {
        //                 expect(res.body).to.be.an.instanceof(Buffer)
        //             })
        //     })
        //
        //     it('should return status code 200 and the subject file template of the pilot study email', () => {
        //         return request
        //             .get(`/v1/emails/templates/${EmailTemplateTypes.PILOT_STUDY_DATA}/${EmailTemplateResources.SUBJECT}`)
        //             .set('Content-Type', FileFormatType.OCTET_STREAM)
        //             .expect(200)
        //             .then(res => {
        //                 expect(res.body).to.be.an.instanceof(Buffer)
        //             })
        //     })
        //
        //     it('should return status code 200 and the text file template of the pilot study email', () => {
        //         return request
        //             .get(`/v1/emails/templates/${EmailTemplateTypes.PILOT_STUDY_DATA}/${EmailTemplateResources.TEXT}`)
        //             .set('Content-Type', FileFormatType.OCTET_STREAM)
        //             .expect(200)
        //             .then(res => {
        //                 expect(res.body).to.be.an.instanceof(Buffer)
        //             })
        //     })
        // })

        context('when there are validation errors', () => {
            context('when the email template type is invalid', () => {
                const emailTemplateTypes: Array<string> = Object.values(EmailTemplateTypes)

                it('should return status code 400 and info message about invalid email template type', () => {
                    return request
                        .get(`/v1/emails/templates/invalidEmailTemplateType/${EmailTemplateResources.HTML}`)
                        .set('Content-Type', FileFormatType.OCTET_STREAM)
                        .expect(400)
                        .then(err => {
                            expect(err.body.message).to.eql(`${Strings.ERROR_MESSAGE.VALIDATE.NOT_MAPPED
                                .replace('{0}', 'type')} invalidEmailTemplateType`)
                            expect(err.body.description)
                                .to.eql(`${Strings.ERROR_MESSAGE.VALIDATE.NOT_MAPPED_DESC} ${emailTemplateTypes.join(', ')}.`)
                        })
                })
            })

            context('when the email template resource type is invalid', () => {
                const templateResourceTypes: Array<string> = Object.values(EmailTemplateResources)

                it('should return status code 400 and info message about invalid email template type', () => {
                    return request
                        .get(`/v1/emails/templates/${EmailTemplateTypes.WELCOME}/invalidResource`)
                        .set('Content-Type', FileFormatType.OCTET_STREAM)
                        .expect(400)
                        .then(err => {
                            expect(err.body.message).to.eql(`${Strings.ERROR_MESSAGE.VALIDATE.NOT_MAPPED
                                .replace('{0}', 'resource')} invalidResource`)
                            expect(err.body.description)
                                .to.eql(`${Strings.ERROR_MESSAGE.VALIDATE.NOT_MAPPED_DESC} ${templateResourceTypes.join(', ')}.`)
                        })
                })
            })
        })
    })
})
