import 'reflect-metadata'
import morgan from 'morgan'
import accessControl from 'express-ip-access-control'
import helmet from 'helmet'
import dns from 'dns'
import bodyParser from 'body-parser'
import HttpStatus from 'http-status-codes'
import swaggerUi from 'swagger-ui-express'
import qs from 'query-strings-parser'
import express, { Application, Request, Response } from 'express'
import { Container, inject, injectable } from 'inversify'
import { InversifyExpressServer } from 'inversify-express-utils'
import { ApiException } from './ui/exception/api.exception'
import { Default } from './utils/default'
import { DI } from './di/di'
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
    private readonly container: Container
    private readonly express: Application

    /**
     * Creates an instance of App.
     */
    constructor(@inject(Identifier.LOGGER) private readonly _logger: ILogger) {
        this.express = express()
        this.container = DI.getInstance().getContainer()
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
        let whitelist = Default.IP_WHITELIST

        if (process.env.HOST_WHITELIST) {
            whitelist = process.env.HOST_WHITELIST
                .replace(/[\[\]]/g, '')
                .split(',')
                .map(item => item.trim())
        }

        // Accept requests from any origin.
        if (whitelist.includes('*') ||
            whitelist.includes('')) return Promise.resolve()

        const promises = whitelist.map(this.getIPFromHost)
        whitelist = await Promise.all(promises)

        this.express.use(accessControl({
            mode: 'allow',
            allows: whitelist,
            log: (clientIp, access) => {
                if (!access) this._logger.warn(`Access denied for IP ${clientIp}`)
            },
            statusCode: 401,
            message: new ApiException(401, 'UNAUTHORIZED',
                'Client is not allowed to access the service...').toJson()
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
            this.container, null, { rootPath: '/' })

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
            app.use(bodyParser.json())
            // create application/x-www-form-urlencoded parser
            app.use(bodyParser.urlencoded({ extended: false }))

            app.use(morgan(':remote-addr :remote-user ":method :url HTTP/:http-version" ' +
                ':status :res[content-length] :response-time ms ":referrer" ":user-agent"', {
                    stream: { write: (str: string) => this._logger.info(str) }
                }
            ))
        })
        this.express.use(inversifyExpress.build())
    }

    /**
     *  Get DNS from a host name.
     *
     * @private
     * @param host
     * @return Promise<void>
     */
    private async getIPFromHost(host: string): Promise<any> {
        return new Promise((resolve, reject) => {
            dns.lookup(host, async (err, ip) => {
                if (err) return reject(err)
                return resolve(ip)
            })
        })
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
            this.express.use('/reference', swaggerUi.serve, swaggerUi.setup(null, options))
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
        this.express.use((req: Request, res: Response) => {
            const errorMessage: ApiException = new ApiException(404, `${req.url} not found.`,
                `Specified resource: ${req.url} was not found or does not exist.`)
            res.status(HttpStatus.NOT_FOUND).send(errorMessage.toJson())
        })

        // Handle 500
        this.express.use((err: any, req: Request, res: Response) => {
            res.locals
            const errorMessage: ApiException = new ApiException(err.code, err.message, err.description)
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(errorMessage.toJson())
        })
    }
}
