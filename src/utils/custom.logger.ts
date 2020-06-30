import fs from 'fs'
import { injectable } from 'inversify'
import { Default } from './default'
import { createLogger, format, Logger, transports } from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'

@injectable()
export class CustomLogger implements ILogger {
    public readonly _logger: Logger
    private readonly _logDir = process.env.LOG_DIR || Default.LOG_DIR
    private _moduleName: string = Default.APP_ID
    private _options: any = {}

    constructor() {
        if (!fs.existsSync(this._logDir)) fs.mkdirSync(this._logDir) // create directory if it does not exist
        this.initOptions() // initialize options logger
        this._logger = this.internalCreateLogger()
    }

    set moduleName(value: string) {
        this._moduleName = value
    }

    get moduleName(): string {
        return this._moduleName
    }

    private internalCreateLogger(): Logger {
        const errorFormat = format((info: any) => {
            if (info instanceof Error) {
                info = info as Error
                return Object.assign({
                    message: info.message.concat(info.description ? ` | ${info.description}` : ''),
                    stack: info.stack
                }, info)
            }
            return info
        })

        return createLogger({
            level: 'silly', // Used by transports that do not have this configuration defined
            silent: false,
            format: format.combine(
                errorFormat(),
                format.timestamp(),
                format.json()
            ),
            transports: [new transports.Console(this._options), this.createTransportDailyRotateFile()],
            exceptionHandlers: [
                new transports.File({ filename: 'exceptions.log' })
            ],
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
                format.printf(log => `${this._moduleName} @ ${log.timestamp} ${log.level}: ${log.message}`)
            )
        }

        if ((process.env.NODE_ENV || Default.NODE_ENV) === 'test') {
            this._options.level = 'none'
            this._options.silent = true
        } else {
            this._options.level = 'debug'
            this._options.silent = false
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

    public error(message: string | object): void {
        if (typeof message === 'string') {
            this._logger.error(message)
            return
        }
        this._logger.error(message)
    }

    public warn(message: string | object): void {
        if (typeof message === 'string') {
            this._logger.warn(message)
            return
        }
        this._logger.warn(message)
    }

    public info(message: string | object): void {
        if (typeof message === 'string') {
            this._logger.info(message)
            return
        }
        this._logger.info(message)
    }

    public debug(message: string | object): void {
        if (typeof message === 'string') {
            this._logger.debug(message)
            return
        }
        this._logger.debug(message)
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
    error(message: string | object): void

    warn(message: string | object): void

    info(message: string | object): void

    debug(message: string | object): void

    addTransport(transport: any): Logger
}
