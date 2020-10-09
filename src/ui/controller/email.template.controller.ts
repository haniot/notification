import HttpStatus from 'http-status-codes'
import { inject } from 'inversify'
import { controller, httpGet, httpPut, request, response } from 'inversify-express-utils'
import { Request, Response } from 'express'
import { Identifier } from '../../di/identifiers'
import { ApiExceptionManager } from '../exception/api.exception.manager'
import { ApiException } from '../exception/api.exception'
import { Strings } from '../../utils/strings'
import { EmailTemplate } from '../../application/domain/model/email.template'
import multer from 'multer'
import { FileFormatType } from '../../application/domain/model/file'
import { IEmailService } from '../../application/port/email.service.interface'

@controller('/v1/emails/templates')
export class EmailTemplateController {

    constructor(
        @inject(Identifier.EMAIL_SERVICE) private readonly _emailService: IEmailService
    ) {
    }

    @httpPut(
        '/:type',
        multer().fields([{ name: 'html', maxCount: 1 }, { name: 'subject', maxCount: 1 }, { name: 'text', maxCount: 1 }])
    )
    public async updateEmailTemplate(@request() req: Request | any, @response() res: Response): Promise<Response> {
        try {
            const html: any = req.files?.html
            const subject: any = req.files?.subject
            const text: any = req.files?.text

            const template: EmailTemplate = new EmailTemplate().fromJSON({
                type: req.params.type,
                html: html && html.length ? {
                    filename: html[0].originalname,
                    buffer: html[0].buffer,
                    mimetype: html[0].mimetype
                } : undefined,
                subject: subject && subject.length ? {
                    filename: subject[0].originalname,
                    buffer: subject[0].buffer,
                    mimetype: subject[0].mimetype
                } : undefined,
                text: text ? {
                    filename: text[0].originalname,
                    buffer: text[0].buffer,
                    mimetype: text[0].mimetype
                } : undefined
            })
            const result: EmailTemplate = await this._emailService.updateTemplate(template)
            if (!result) return res.status(HttpStatus.NOT_FOUND).send(this.getMessageNotFound())
            return res.status(HttpStatus.NO_CONTENT).send()
        } catch (err) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code).send(handlerError.toJSON())
        }
    }

    @httpGet('/:type/:resource')
    public async downloadEmailTemplate(@request() req: Request, @response() res: Response): Promise<void | Response> {
        try {
            const type: string = req.params.type
            const resource: string = req.params.resource
            const result: Buffer = await this._emailService.findTemplateByTypeAndResource(type, resource)
            if (!result) return res.status(HttpStatus.NOT_FOUND).send(this.getMessageNotFound())
            res.set('Content-Type', FileFormatType.OCTET_STREAM)
            res.set('Content-Disposition', `filename=${resource}.pug`)
            res.status(HttpStatus.OK).end(result)
        } catch (err) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code).send(handlerError.toJSON())
        }
    }

    public toJSONView(tempalte: EmailTemplate): object {
        return tempalte.toJSON()
    }

    private getMessageNotFound(): object {
        return new ApiException(
            HttpStatus.NOT_FOUND,
            Strings.EMAIL_TEMPLATE.NOT_FOUND,
            Strings.EMAIL_TEMPLATE.NOT_FOUND_DESCRIPTION
        ).toJSON()
    }
}
