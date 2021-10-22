import HttpStatus from 'http-status-codes'
import { inject } from 'inversify'
import { controller, httpDelete, httpPost, request, response } from 'inversify-express-utils'
import { Request, Response } from 'express'
import { Identifier } from '../../di/identifiers'
import { ApiExceptionManager } from '../exception/api.exception.manager'
import { IPushService } from '../../application/port/push.service.interface'
import { Push } from '../../application/domain/model/push'

@controller('/v1/push')
export class PushController {

    constructor(
        @inject(Identifier.PUSH_SERVICE) private readonly _pushService: IPushService
    ) {
    }

    @httpPost('/')
    public async sendPush(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const push: Push = new Push().fromJSON(req.body)
            const result: Push = await this._pushService.send(push)
            return res.status(HttpStatus.CREATED).send(this.toJSONView(result))
        } catch (err: any) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code).send(handlerError.toJSON())
        }
    }

    @httpDelete('/:push_id')
    public async deletePush(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            await this._pushService.remove(req.params.push_id)
            return res.status(HttpStatus.NO_CONTENT).send()
        } catch (err: any) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code).send(handlerError.toJSON())
        }
    }

    @httpPost('/:push_id/read')
    public async confirmPushRead(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            await this._pushService.confirmPushRead(req.params.push_id)
            return res.status(HttpStatus.NO_CONTENT).send()
        } catch (err: any) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code).send(handlerError.toJSON())
        }
    }

    private toJSONView(push: Push | Array<Push>): object {
        if (push instanceof Array) return push.map(item => this.toJSONView(item))
        const result: any = push.toJSON()
        delete result.keep_it
        return result
    }
}
