import HttpStatus from 'http-status-codes'
import { inject } from 'inversify'
import { controller, httpDelete, httpPost, request, response } from 'inversify-express-utils'
import { Request, Response } from 'express'
import { Identifier } from '../../di/identifiers'
import { ApiExceptionManager } from '../exception/api.exception.manager'
import { IPushNotificationService } from '../../application/port/push.notification.service.interface'
import { PushNotification } from '../../application/domain/model/push.notification'

@controller('/v1/push')
export class PushController {

    constructor(
        @inject(Identifier.PUSH_NOTIFICATION_SERVICE) private readonly _pushService: IPushNotificationService
    ) {
    }

    @httpPost('/')
    public async sendPush(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const push: PushNotification = new PushNotification().fromJSON(req.body)
            const result: PushNotification = await this._pushService.send(push)
            return res.status(HttpStatus.CREATED).send(this.toJSONView(result))
        } catch (err) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code).send(handlerError.toJSON())
        }
    }

    @httpDelete('/:push_id')
    public async deletePush(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            await this._pushService.remove(req.params.push_id)
            return res.status(HttpStatus.NO_CONTENT).send()
        } catch (err) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code).send(handlerError.toJSON())
        }
    }

    @httpPost('/:push_id/read')
    public async confirmPushRead(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            await this._pushService.confirmPushRead(req.params.push_id)
            return res.status(HttpStatus.NO_CONTENT).send()
        } catch (err) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code).send(handlerError.toJSON())
        }
    }

    private toJSONView(push: PushNotification | Array<PushNotification>): object {
        if (push instanceof Array) return push.map(item => this.toJSONView(item))
        const result: any = push.toJSON()
        delete result.keep_it
        return result
    }
}
