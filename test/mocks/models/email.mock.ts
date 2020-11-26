import { Email } from '../../../src/application/domain/model/email'
import { Address } from '../../../src/application/domain/model/address'
import { GeneratorMock } from '../generator.mock'
import { Attachment } from '../../../src/application/domain/model/attachment'
import { DefaultEntityMock } from './default.entity.mock'

export class EmailMock {

    public generate(): Email {
        const email: Email = new Email()
        email.id = GeneratorMock.generateObjectId()
        email.from = new Address('Default From Sender', 'default_from_email@mail.com')
        email.reply = new Address('Default Sender', 'default_email@mail.com')
        email.to = new Array(new Address(`Test ${email.id}`, `${email.id}@mail.com`))
        email.cc = new Array(new Address(`Test ${email.id}`, `${email.id}@mail.com`))
        email.bcc = new Array(new Address(`Test ${email.id}`, `${email.id}@mail.com`))
        email.subject = GeneratorMock.generateLoremIpsum(Math.floor(Math.random() * 100) + 1)
        email.text = GeneratorMock.generateLoremIpsum(Math.floor(Math.random() * 500) + 1)
        email.html = GeneratorMock.generateLoremIpsum(Math.floor(Math.random() * 2000) + 1)
        email.attachments = [new Attachment().fromJSON(DefaultEntityMock.ATTACHMENT)]
        email.createdAt = new Date().toISOString()
        email.userId = GeneratorMock.generateObjectId()

        return email
    }
}
