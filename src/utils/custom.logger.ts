import fs from 'fs'
import { injectable } from 'inversify'
import { Default } from './default'
import { createLogger, format, Logger, transports } from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'

@injectable()
export class CustomLogger implements ILogger {
    private readonly _logger: Logger
    private readonly _logDir = process.env.LOG_DIR || Default.LOG_DIR
    private _options: any = {}

    constructor() {
        if (!fs.existsSync(this._logDir)) fs.mkdirSync(this._logDir) // create directory if it does not exist
        this.initOptions() // initialize options logger
        this._logger = this.internalCreateLogger()
    }

    get logger(): Logger {
        return this._logger
    }

    private internalCreateLogger(): Logger {
        return createLogger({
            level: 'silly', // Used by transports that do not have this configuration defined
            silent: false,
            format: format.combine(
                format.timestamp(),
                format.json()
            ),
            transports: [new transports.Console(this._options), this.createTransportDailyRotateFile()],
            exitOnError: false
        })
    }

    private initOptions(): void {
        this._options = {
            handleExceptions: true,
            format: format.combine(
                format.colorize(),
                format.splat(),
                format.timestamp(),
                format.printf(
                    info => `${info.timestamp} ${info.level}: ${info.message}`
                )
            )
        }

        switch ((process.env.NODE_ENV || Default.NODE_ENV)) {
            case 'production':
                this._options.level = 'warning'
                this._options.silent = false
                break
            case 'test':
                this._options.level = 'none'
                this._options.silent = true
                break
            default: // development or other
                this._options.level = 'debug'
                this._options.silent = false
                break
        }
    }

    private createTransportDailyRotateFile(): any {
        return new DailyRotateFile({
            handleExceptions: true,
            filename: `${this._logDir}/%DATE%-results.log`,
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxFiles: '15d'
        })
    }

    public addTransport(transport: any): Logger {
        return this._logger.add(transport)
    }

    public error(message: string): void {
        this._logger.error(message)
    }

    public warn(message: string): void {
        this._logger.warn(message)
    }

    public info(message: string): void {
        this._logger.info(message)
    }

    public verbose(message: string): void {
        this._logger.verbose(message)
    }

    public debug(message: string): void {
        this._logger.debug(message)
    }

    public silly(message: string): void {
        this._logger.silly(message)
    }
}

/**
 * Logger interface.
 * logging levels are prioritized from 0 to 5 (highest to lowest):
 *   error: 0,
 *   warn: 1,
 *   info: 2,
 *   verbose: 3,
 *   debug: 4,
 *   silly: 5
 *
 * @see {@link https://github.com/winstonjs/winston#using-logging-levels} for further information.
 */
export interface ILogger {
    logger: Logger

    error(message: string): void

    warn(message: string): void

    info(message: string): void

    verbose(message: string): void

    debug(message: string): void

    silly(message: string): void

    addTransport(transport: any): Logger
}
