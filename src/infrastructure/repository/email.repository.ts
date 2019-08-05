import nodeMailer from 'nodemailer'
import { inject, injectable } from 'inversify'
import { BaseRepository } from './base/base.repository'
import { EmailEntity } from '../entity/email.entity'
import { Email } from '../../application/domain/model/email'
import { IEmailRepository } from '../../application/port/email.repository.interface'
import { Identifier } from '../../di/identifiers'
import { ILogger } from '../../utils/custom.logger'
import { IEntityMapper } from '../port/entity.mapper.interface'
import { Address } from '../../application/domain/model/address'
import { ValidationException } from '../../application/domain/exception/validation.exception'

/**
 * Implementation of the email repository.
 *
 * @implements {IEmailRepository}
 */
@injectable()
export class EmailRepository extends BaseRepository<Email, EmailEntity> implements IEmailRepository {
    private readonly smtpTransport: any

    constructor(
        @inject(Identifier.EMAIL_REPO_MODEL) readonly userModel: any,
        @inject(Identifier.EMAIL_ENTITY_MAPPER) readonly userMapper: IEntityMapper<Email, EmailEntity>,
        @inject(Identifier.LOGGER) readonly logger: ILogger
    ) {
        super(userModel, userMapper, logger)
        this.smtpTransport = this.createSmtpTransport()
    }

    /**
     * Send email using the NodeMailer library.
     *
     * @param email
     * @return Promise<Email>
     */
    public async send(email: Email): Promise<Email> {
        email.from = new Address('HANIoT', process.env.SMTP_EMAIL)
        const emailSendNodeMailer: any = this.convertEmailToNodeMailer(email)

        console.log('result', emailSendNodeMailer)
        try {
            await this.smtpTransport.sendMail(emailSendNodeMailer)
        } catch (err) {
            if (err.code && err.code === 'ESTREAM') {
                let message = err.message
                if (err.sourceUrl) message = `Error loading URL file: ${err.sourceUrl}`
                return Promise.reject(
                    new ValidationException('There was a problem with your attachments!', message)
                )
            }
            this.logger.error(err)
            return Promise.reject(err)
        }
        return super.create(email)
    }

    /**
     * Create the SMTP NodeMailer transport.
     *
     * @return SMTP transport.
     */
    private createSmtpTransport(): any {
        const smtpPort = Number(process.env.SMTP_PORT)
        return nodeMailer.createTransport({
            host: process.env.SMTP_HOST,
            port: smtpPort,
            secure: smtpPort === 465, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD
            },
            tls: {
                // do not fail on invalid certs
                rejectUnauthorized: false
            }
        })
    }

    /**
     *  Convert the {Email} object to the type accepted by the NodeMailer library.
     *  Format NodeMailer:
     *  {
     *       from: {
     *          name: 'string',
     *          address: 'string'
     *       },
     *       replyTo: {
     *           name: 'string',
     *           address: 'string'
     *       },
     *       to: [{
     *          name: string,
     *          address: string
     *       }],
     *       cc: [{
     *           name: 'string',
     *           address: 'string'
     *       }],
     *       bcc: [{
     *           name: 'string',
     *           address: 'string'
     *       }],
     *       subject: 'string',
     *       text: 'string',
     *       html: 'string',
     *       attachments: [{
     *          filename: 'string',
     *          path: 'string',
     *          contentType: 'string'
     *       }]
     *  }
     *
     * @param email
     * @return object
     */
    private convertEmailToNodeMailer(email: Email): any {
        const result: any = {}

        result.from = { name: email.from.name, address: email.from.email }
        if (email.reply) result.replyTo = { name: email.reply.name, address: email.reply.email }
        result.to = email.to.map(elem => {
            return { name: elem.name, address: elem.email }
        })
        result.cc = email.cc ? email.to.map(elem => {
            return { name: elem.name, address: elem.email }
        }) : undefined
        result.bcc = email.bcc ? email.to.map(elem => {
            return { name: elem.name, address: elem.email }
        }) : undefined
        if (email.subject) result.subject = email.subject
        if (email.text) result.text = email.text
        if (email.html) result.html = email.html
        result.attachments = email.attachments ? email.attachments.map(elem => {
            return {
                filename: elem.filename,
                path: elem.path,
                contentType: elem.contentType
            }
        }) : undefined

        return result
    }
}
