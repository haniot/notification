import HttpStatus from 'http-status-codes'
import { inject } from 'inversify'
import { controller, httpGet, request, response } from 'inversify-express-utils'
import { Request, Response } from 'express'
import { Identifier } from '../../di/identifiers'
import { ApiExceptionManager } from '../exception/api.exception.manager'
import { IPushService } from '../../application/port/push.service.interface'
import { Push } from '../../application/domain/model/push'
import { Query } from '../../infrastructure/repository/query/query'
import { IQuery } from '../../application/port/query.interface'

@controller('/v1/users/:user_id/push')
export class UsersPushController {
    constructor(
        @inject(Identifier.PUSH_SERVICE) private readonly _pushService: IPushService
    ) {
    }

    @httpGet('/')
    public async getAllPushFromUser(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const query: IQuery = new Query().fromJSON(req.query)
            query.addFilter({ to: req.params.user_id })
            const result: Array<Push> = await this._pushService.getAll(query)
            const count: number = await this._pushService.count(query)
            res.setHeader('X-Total-Count', count)
            return res.status(HttpStatus.OK).send(this.toJSONView(result))
        } catch (err) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code).send(handlerError.toJSON())
        } finally {
            req.query = {}
        }
    }

    private toJSONView(push: Push | Array<Push>): object {
        if (push instanceof Array) return push.map(item => this.toJSONView(item))
        const result: any = push.toJSON()
        delete result.keep_it
        return result
    }
}
