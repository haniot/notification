import HttpStatus from 'http-status-codes'
import { inject } from 'inversify'
import { controller, httpDelete, httpGet, httpPost, request, response } from 'inversify-express-utils'
import { Request, Response } from 'express'
import { Identifier } from '../../di/identifiers'
import { ApiExceptionManager } from '../exception/api.exception.manager'
import { ApiException } from '../exception/api.exception'
import { Strings } from '../../utils/strings'
import { IEmailService } from '../../application/port/email.service.interface'
import { Email } from '../../application/domain/model/email'
import { Query } from '../../infrastructure/repository/query/query'

/**
 * Controller that implements Email feature operations.
 *
 * @remarks To define paths, we use library inversify-express-utils.
 * @see {@link https://github.com/inversify/inversify-express-utils} for further information.
 */
@controller('/v1/users/:user_id/emails')
export class EmailController {

    /**
     * Creates an instance of User controller.
     *
     * @param {IEmailService} _emailService
     */
    constructor(
        @inject(Identifier.EMAIL_SERVICE) private readonly _emailService: IEmailService
    ) {
    }

    /**
     * Change user password.
     *
     * @param req
     * @param res
     */
    @httpPost('/')
    public async sendEmail(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const email: Email = new Email().fromJSON(req.body)
            email.userId = req.params.user_id
            const result: Email = await this._emailService.send(email)
            return res.status(HttpStatus.CREATED).send(this.toJSONView(result))
        } catch (err) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code).send(handlerError.toJson())
        }
    }

    /**
     * Get all emails.
     * For the query strings, the query-strings-parser middleware was used.
     * @see {@link https://www.npmjs.com/package/query-strings-parser} for further information.
     *
     * @param {Request} req
     * @param {Response} res
     */
    @httpGet('/')
    public async getAllEmailsFromUser(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const result: Array<Email> = await this._emailService
                .getAllFromUser(req.params.user_id, new Query().fromJSON(req.query))
            const count: number = await this._emailService.count(new Query())
            res.setHeader('X-Total-Count', count)
            return res.status(HttpStatus.OK).send(this.toJSONView(result))
        } catch (err) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code).send(handlerError.toJson())
        } finally {
            req.query = {}
        }
    }

    /**
     * Get email by id.
     * For the query strings, the query-strings-parser middleware was used.
     * @see {@link https://www.npmjs.com/package/query-strings-parser} for further information.
     *
     * @param {Request} req
     * @param {Response} res
     */
    @httpGet('/:email_id')
    public async getEmailByIdAndFromUser(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const result: Email = await this._emailService
                .getByIdAndFromUser(req.params.email_id, req.params.user_id, new Query().fromJSON(req.query))
            if (!result) return res.status(HttpStatus.NOT_FOUND).send(this.getMessageNotFound())
            return res.status(HttpStatus.OK).send(this.toJSONView(result))
        } catch (err) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code).send(handlerError.toJson())
        }
    }

    /**
     * Remove email by id.
     *
     * @param {Request} req
     * @param {Response} res
     */
    @httpDelete('/:email_id')
    public async deleteEmailByIdAndFromUser(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            await this._emailService.remove(req.params.email_id)
            return res.status(HttpStatus.NO_CONTENT).send()
        } catch (err) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code).send(handlerError.toJson())
        }
    }

    /**
     * Convert object to json format expected by view.
     *
     * @param email
     */
    private toJSONView(email: Email | Array<Email>): object {
        if (email instanceof Array) return email.map((item: Email) => {
            return {
                id: item.id,
                to: item.to.map(value => value.toJSON()),
                subject: item.subject,
                text: this.getTextTrucated(item),
                created_at: item.createdAt
            }
        })
        return email.toJSON()
    }

    /**
     * Returns truncated string of the text or HTML of the email.
     *
     * @param email
     */
    private getTextTrucated(email: Email): string {
        if (email.text) return email.text.slice(0, 500).concat('...')
        else if (email.html) return email.html.slice(0, 500).concat('...')
        return ''
    }

    /**
     * Default message when resource is not found or does not exist.
     */
    private getMessageNotFound(): object {
        return new ApiException(
            HttpStatus.NOT_FOUND,
            Strings.EMAIL.NOT_FOUND,
            Strings.EMAIL.NOT_FOUND_DESCRIPTION
        ).toJson()
    }
}
