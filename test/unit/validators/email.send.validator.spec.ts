import { assert } from 'chai'
import { EmailSendValidator } from '../../../src/application/domain/validator/email.send.validator'
import { ValidationException } from '../../../src/application/domain/exception/validation.exception'
import { Strings } from '../../../src/utils/strings'
import { Email } from '../../../src/application/domain/model/email'
import { EmailMock } from '../../mocks/models/email.mock'
import { Attachment } from '../../../src/application/domain/model/attachment'

describe('VALIDATORS: EmailSendValidator', () => {
    let email: Email = new EmailMock().generate()

    afterEach(() => {
        email = new EmailMock().generate()
    })

    context('when the email is valid', () => {
        it('should return undefined when the validation was successful', () => {
            try {
                const result = EmailSendValidator.validate(email)
                assert.isUndefined(result)
            } catch (err) {
                assert.fail(err)
            }
        })
    })

    context('when the email is incomplete', () => {
        it('should throw ValidationException for an incomplete email (missing subject)', () => {
            try {
                email.subject = undefined!
                EmailSendValidator.validate(email)
                assert.fail()
            } catch (err) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS)
                assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS_DESC
                    .replace('{0}', 'subject'))
            }
        })

        it('should throw ValidationException for an incomplete email (missing reply.email)', () => {
            try {
                email.reply!.email = undefined!
                EmailSendValidator.validate(email)
                assert.fail()
            } catch (err) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_REPLY_EMAIL)
            }
        })

        it('should throw ValidationException for an incomplete email (missing to.email)', () => {
            try {
                email.to[0].email = undefined!
                EmailSendValidator.validate(email)
                assert.fail()
            } catch (err) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_TO_EMAIL)
            }
        })

        it('should throw ValidationException for an incomplete email (missing cc.email)', () => {
            try {
                email.cc![0].email = undefined!
                EmailSendValidator.validate(email)
                assert.fail()
            } catch (err) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_CC_EMAIL)
            }
        })

        it('should throw ValidationException for an incomplete email (missing bcc.email)', () => {
            try {
                email.bcc![0].email = undefined!
                EmailSendValidator.validate(email)
                assert.fail()
            } catch (err) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_BCC_EMAIL)
            }
        })

        it('should throw ValidationException for an incomplete email (missing attachments.path)', () => {
            try {
                email.attachments![0] = new Attachment()
                EmailSendValidator.validate(email)
                assert.fail()
            } catch (err) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_ATTACHMENTS_PATH)
            }
        })

        it('should throw ValidationException for an incomplete email (missing all fields)', () => {
            try {
                EmailSendValidator.validate(new Email())
                assert.fail()
            } catch (err) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS)
                assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS_DESC
                    .replace('{0}', 'subject, to'))
            }
        })
    })

    context('when the \'to\' array of the email is empty', () => {
        it('should throw a ValidationException for empty \'to\' array', () => {
            try {
                email.to = []
                EmailSendValidator.validate(email)
                assert.fail()
            } catch (err) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.VALIDATE.EMPTY_TO)
            }
        })
    })

    context('when the email is invalid', () => {
        it('should throw a ValidationException for invalid reply email', () => {
            try {
                email.reply!.email = 'invalid_email@mailcom'
                EmailSendValidator.validate(email)
                assert.fail()
            } catch (err) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.VALIDATE.INVALID_EMAIL
                    .replace('{0}', 'invalid_email@mailcom'))
            }
        })

        it('should throw a ValidationException for invalid \'to\' email', () => {
            try {
                email.to[0].email = 'invalid_email@mailcom'
                EmailSendValidator.validate(email)
                assert.fail()
            } catch (err) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.VALIDATE.INVALID_EMAIL
                    .replace('{0}', 'invalid_email@mailcom'))
            }
        })

        it('should throw a ValidationException for invalid \'cc\' email', () => {
            try {
                email.cc![0].email = 'invalid_email@mailcom'
                EmailSendValidator.validate(email)
                assert.fail()
            } catch (err) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.VALIDATE.INVALID_EMAIL
                    .replace('{0}', 'invalid_email@mailcom'))
            }
        })

        it('should throw a ValidationException for invalid \'bcc\' email', () => {
            try {
                email.bcc![0].email = 'invalid_email@mailcom'
                EmailSendValidator.validate(email)
                assert.fail()
            } catch (err) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.VALIDATE.INVALID_EMAIL
                    .replace('{0}', 'invalid_email@mailcom'))
            }
        })
    })
})
