import HttpStatus from 'http-status-codes'
import { inject } from 'inversify'
import { controller, httpDelete, httpGet, httpPut, request, response } from 'inversify-express-utils'
import { Request, Response } from 'express'
import { Identifier } from '../../di/identifiers'
import { ApiExceptionManager } from '../exception/api.exception.manager'
import { ApiException } from '../exception/api.exception'
import { Strings } from '../../utils/strings'
import { IPushTokenService } from '../../application/port/push.token.service.interface'
import { PushToken } from '../../application/domain/model/push.token'

@controller('/v1/users/:user_id/push')
export class UsersPushTokensController {

    constructor(
        @inject(Identifier.PUSH_TOKEN_SERVICE) private readonly _pushTokenService: IPushTokenService
    ) {
    }

    @httpGet('/tokens')
    public async getPushTokensFromUser(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const result: any = await this._pushTokenService.findFromUser(req.params.user_id)
            if (!result) return res.status(HttpStatus.NOT_FOUND).send(this.getMessageNotFound())
            return res.status(HttpStatus.OK).send(result)
        } catch (err) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code).send(handlerError.toJSON())
        }
    }

    @httpPut('/:client_type/tokens')
    public async sendEmail(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const push_token: PushToken = new PushToken().fromJSON(req.body)
            push_token.user_id = req.params.user_id
            push_token.client_type = req.params.client_type
            const result: PushToken = await this._pushTokenService.createOrUpdate(push_token)
            if (!result) return res.status(HttpStatus.NOT_FOUND).send(this.getMessageNotFound())
            return res.status(HttpStatus.NO_CONTENT).send()
        } catch (err) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code).send(handlerError.toJSON())
        }
    }

    @httpDelete('/:client_type/tokens')
    public async deletePushTokenFromUser(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            await this._pushTokenService.deleteFromUser(req.params.user_id, req.params.client_type)
            return res.status(HttpStatus.NO_CONTENT).send()
        } catch (err) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code).send(handlerError.toJSON())
        }
    }


    private getMessageNotFound(): object {
        return new ApiException(
            HttpStatus.NOT_FOUND,
            Strings.PUSH_TOKEN.NOT_FOUND,
            Strings.PUSH_TOKEN.NOT_FOUND_DESCRIPTION
        ).toJSON()
    }
}
