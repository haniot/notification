import { assert } from 'chai'
import { DefaultEntityMock } from '../../mocks/models/default.entity.mock'
import { EmailPilotStudyDataValidator } from '../../../src/application/domain/validator/email.pilot.study.data.validator'
import { ValidationException } from '../../../src/application/domain/exception/validation.exception'
import { Strings } from '../../../src/utils/strings'

describe('VALIDATORS: EmailPilotStudyDataValidator', () => {
    let pilotStudyDataEmail: any = JSON.parse(JSON.stringify(DefaultEntityMock.PILOT_STUDY_DATA_EMAIL))

    afterEach(() => {
        pilotStudyDataEmail = JSON.parse(JSON.stringify(DefaultEntityMock.PILOT_STUDY_DATA_EMAIL))
    })

    context('when the pilot study data email is valid', () => {
        it('should return undefined when the validation was successful', () => {
            try {
                const result = EmailPilotStudyDataValidator.validate(pilotStudyDataEmail)
                assert.isUndefined(result)
            } catch (err) {
                assert.fail(err)
            }
        })
    })

    context('when the pilot study data email is incomplete', () => {
        it('should throw ValidationException for an incomplete pilot study data email (missing attachments fields)', () => {
            try {
                pilotStudyDataEmail.attachments = [{}]
                EmailPilotStudyDataValidator.validate(pilotStudyDataEmail)
                assert.fail()
            } catch (err) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS)
                assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS_DESC
                    .replace('{0}', 'attachments.filename, attachments.path, attachments.content_type'))
            }
        })

        it('should throw ValidationException for an incomplete pilot study data email (missing all fields)', () => {
            try {
                EmailPilotStudyDataValidator.validate({})
                assert.fail()
            } catch (err) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS)
                assert.propertyVal(err, 'description', Strings.ERROR_MESSAGE.VALIDATE.REQUIRED_FIELDS_DESC
                    .replace('{0}', 'to, pilot_study, request_date, action_url, attachments'))
            }
        })
    })

    context('when the attachments array of the pilot study data email is empty', () => {
        it('should throw a ValidationException for empty attachments array', () => {
            try {
                pilotStudyDataEmail.attachments = []
                EmailPilotStudyDataValidator.validate(pilotStudyDataEmail)
                assert.fail()
            } catch (err) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.VALIDATE.EMPTY_ATTACHMENTS)
            }
        })
    })

    context('when the \'to\' email from the pilot study data email is invalid', () => {
        it('should throw a ValidationException for invalid email', () => {
            try {
                pilotStudyDataEmail.to.email = 'invalid_email@mailcom'
                EmailPilotStudyDataValidator.validate(pilotStudyDataEmail)
                assert.fail()
            } catch (err) {
                assert.instanceOf(err, ValidationException)
                assert.propertyVal(err, 'message', Strings.ERROR_MESSAGE.VALIDATE.INVALID_EMAIL
                    .replace('{0}', 'invalid_email@mailcom'))
            }
        })
    })
})
