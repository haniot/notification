import { Email } from '../../src/application/domain/model/email'
import { Address } from '../../src/application/domain/model/address'
import { GeneratorMock } from './generator.mock'

export class EmailMock extends Email {

    constructor() {
        super()
        this.generateUser()
    }

    private generateUser(): void {
        super.id = GeneratorMock.generateObjectId()
        super.from = new Address('NOTIFICATION/HANIoT', process.env.SMTP_EMAIL)
        super.reply = new Address('NOTIFICATION/HANIoT', process.env.SMTP_EMAIL)
        super.to = new Array(new Address(`Test ${super.id}`, `${super.id}@mail.com`))
        super.subject = GeneratorMock.generateLoremIpsum(Math.floor(Math.random() * 100))
        super.text = GeneratorMock.generateLoremIpsum(Math.floor(Math.random() * 500))
        super.html = GeneratorMock.generateLoremIpsum(Math.floor(Math.random() * 2000))
        super.createdAt = new Date().toISOString()
        super.userId = GeneratorMock.generateObjectId()
    }
}
