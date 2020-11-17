import { Email } from '../../../src/application/domain/model/email'
import { Address } from '../../../src/application/domain/model/address'
import { GeneratorMock } from '../generator.mock'

export class EmailMock {

    public generate(): Email {
        const email: Email = new Email()
        email.id = GeneratorMock.generateObjectId()
        email.from = new Address('NOTIFICATION/HANIoT', process.env.SMTP_USER)
        email.reply = new Address('NOTIFICATION/HANIoT', process.env.SMTP_USER)
        email.to = new Array(new Address(`Test ${email.id}`, `${email.id}@mail.com`))
        email.subject = GeneratorMock.generateLoremIpsum(Math.floor(Math.random() * 100))
        email.text = GeneratorMock.generateLoremIpsum(Math.floor(Math.random() * 500))
        email.html = GeneratorMock.generateLoremIpsum(Math.floor(Math.random() * 2000))
        email.createdAt = new Date().toISOString()
        email.userId = GeneratorMock.generateObjectId()

        return email
    }
}
