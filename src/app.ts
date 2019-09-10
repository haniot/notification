import 'reflect-metadata'
import morgan from 'morgan'
import helmet from 'helmet'
import ipAllowed from 'ip-allowed'
import bodyParser from 'body-parser'
import HttpStatus from 'http-status-codes'
import swaggerUi from 'swagger-ui-express'
import qs from 'query-strings-parser'
import express, { Application, NextFunction, Request, Response } from 'express'
import { inject, injectable } from 'inversify'
import { InversifyExpressServer } from 'inversify-express-utils'
import { ApiException } from './ui/exception/api.exception'
import { Default } from './utils/default'
import { DIContainer } from './di/di'
import { Identifier } from './di/identifiers'
import { ILogger } from './utils/custom.logger'
import { Strings } from './utils/strings'

/**
 * Implementation of class App.
 * You must initialize all application settings,
 * such as dependency injection and middleware settings.
 */
@injectable()
export class App {
    private readonly express: Application

    /**
     * Creates an instance of App.
     */
    constructor(@inject(Identifier.LOGGER) private readonly _logger: ILogger) {
        this.express = express()
        this.bootstrap()
    }

    /**
     * Get express instance.
     *
     * @return {Application}
     */
    public getExpress(): Application {
        return this.express
    }

    /**
     * Initialize app settings.
     *
     * @private
     * @return void
     */
    private bootstrap(): void {
        this.initMiddleware()
    }

    /**
     * Initialize middleware.
     *
     * @private
     * @return void
     */
    private async initMiddleware(): Promise<void> {
        try {
            await this.setupHostWhitelist()
            await this.setupInversifyExpress()
            this.setupSwaggerUI()
            this.setupErrorsHandler()
        } catch (err) {
            this._logger.error(`Fatal error in middleware configuration: ${(err && err.message) ? err.message : ''}`)
        }
    }

    /**
     * Access control based on host addresses.
     * Only allow requests from the hosts that are on the permissions list.
     *
     * @private
     * @return Promise<void>
     */
    private async setupHostWhitelist(): Promise<void> {
        this.express.use(ipAllowed(process.env.HOST_WHITELIST || Default.HOST_WHITELIST, {
            log: (clientIp, accessDenied) => {
                if (accessDenied) this._logger.warn(`Client with IP address ${clientIp} is not allowed!`)
            }
        }))
    }

    /**
     * Setup Inversify.
     * Responsible for injecting routes defined through annotations in controllers.
     * Other middleware are also injected, such as query-strings-parser, helmet, body-parser, morgan...
     *
     * @private
     * @return Promise<void>
     */
    private async setupInversifyExpress(): Promise<void> {
        const inversifyExpress: InversifyExpressServer = new InversifyExpressServer(
            DIContainer, null, { rootPath: '/' })

        inversifyExpress.setConfig((app: Application) => {
            // for handling query strings
            // {@link https://www.npmjs.com/package/query-strings-parser}
            app.use(qs({
                use_page: true,
                default: {
                    pagination: { limit: 100 },
                    sort: { created_at: 'desc' }
                }
            }))

            // helps you secure your Express apps by setting various HTTP headers.
            // {@link https://www.npmjs.com/package/helmet}
            app.use(helmet())

            // create application/json parser
            // {@link https://www.npmjs.com/package/body-parser}
            app.use(bodyParser.json({ limit: '15mb', type: 'application/json' }))
            // create application/x-www-form-urlencoded parser
            app.use(bodyParser.urlencoded({ extended: false }))

            app.use(morgan(':remote-addr :remote-user ":method :url HTTP/:http-version" ' +
                ':status :res[content-length] :response-time ms ":referrer" ":user-agent"', {
                    stream: { write: (str: string) => this._logger.info(str) }
                }
            ))

            // app.use((err, req, res, next) => {
            //     next(err)
            // })
        })
        this.express.use(inversifyExpress.build())
    }

    /**
     * Setup swagger ui.
     *
     * @private
     * @return Promise<void>
     */
    private setupSwaggerUI(): void {
        // Middleware swagger. It should not run in the test environment.
        if ((process.env.NODE_ENV || Default.NODE_ENV) !== 'test') {
            const options = {
                swaggerUrl: Default.SWAGGER_URI,
                customCss: '.swagger-ui .topbar { display: none }',
                customfavIcon: Default.LOGO_URI,
                customSiteTitle: `API Reference | ${Strings.APP.TITLE}`
            }
            this.express.use('/v1/reference', swaggerUi.serve, swaggerUi.setup(null, options))
        }
    }

    /**
     * Initializes error routes available in the application.
     *
     * @private
     * @return void
     */
    private setupErrorsHandler(): void {
        // Handle 404
        this.express.use((req, res) => {
            const errorMessage: ApiException = new ApiException(404, `${req.url} not found.`,
                `Specified resource: ${req.url} was not found or does not exist.`)
            res.status(HttpStatus.NOT_FOUND).send(errorMessage.toJson())
        })

        // Handle 400, 500
        this.express.use((err: any, req: Request, res: Response, next: NextFunction) => {
            let statusCode = HttpStatus.INTERNAL_SERVER_ERROR
            const errorMessage: ApiException = new ApiException(statusCode, err.message)
            if (err && err.statusCode === HttpStatus.BAD_REQUEST) {
                statusCode = HttpStatus.BAD_REQUEST
                errorMessage.code = statusCode
                errorMessage.message = 'Unable to process request body.'
                errorMessage.description = 'Please verify that the JSON provided in'
                    .concat(' the request body has a valid format and try again.')
            }
            res.status(statusCode).send(errorMessage.toJson())
        })
    }
}
