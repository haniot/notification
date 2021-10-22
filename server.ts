import fs from 'fs'
import http from 'http'
import https from 'https'
import { Application } from 'express'
import { Identifier } from './src/di/identifiers'
import { DIContainer } from './src/di/di'
import { ILogger } from './src/utils/custom.logger'
import { BackgroundService } from './src/background/background.service'
import { Default } from './src/utils/default'
import { App } from './src/app'

/**
 *  Create the .env file in the root directory of your project
 *  and add your environment variables to new lines in the
 *  format NAME=VALUE. For example:
 *      DB_HOST=localhost
 *      DB_USER=root
 *      DB_PASS=mypass
 *
 *  The fastest way is to create a copy of the .env.example file.
 */
require('dotenv').config()

const logger: ILogger = DIContainer.get<ILogger>(Identifier.LOGGER)
const app: Application = (DIContainer.get<App>(Identifier.APP)).getExpress()
const backgroundServices: BackgroundService = DIContainer.get(Identifier.BACKGROUND_SERVICE)
const port_http = process.env.PORT_HTTP || Default.PORT_HTTP
const port_https = process.env.PORT_HTTPS || Default.PORT_HTTPS
const https_options = {
    key: fs.readFileSync(process.env.SSL_KEY_PATH || Default.SSL_KEY_PATH),
    cert: fs.readFileSync(process.env.SSL_CERT_PATH || Default.SSL_CERT_PATH)
}

/**
 * Initializes HTTP server and redirects accesses to HTTPS.
 */
http.createServer((req, res) => {
    const host = req.headers.host || ''
    const newLocation = 'https://' + host.replace(/:\d+/, ':' + port_https) + req.url
    res.writeHead(301, { Location: newLocation })
    res.end()
}).listen(port_http)

/**
 * Initializes HTTPS server.
 * After the successful startup, listener is initialized
 * for important events and background services.
 */
https.createServer(https_options, app)
    .listen(port_https, () => {
        logger.debug(`Server HTTPS running on port ${port_https}`)

        initListener()
        backgroundServices.startServices()
            .then(() => {
                logger.debug('Background services successfully initialized...')
            })
            .catch(err => {
                logger.error(err.message)
                process.exit()
            })
    })

/**
 * Function to listen to the SIGINT event and end services
 * in the background, when the respective event is triggered.
 */
function initListener(): void {
    process.on('SIGINT', async () => {
        try {
            await backgroundServices.stopServices()
        } catch (err: any) {
            logger.error(`There was an error stopping all background services. ${err.message}`)
        } finally {
            logger.debug('Background services successfully closed...')
        }
        process.exit()
    })
}
