import * as fs from 'fs'
import * as path from 'path'
import { assert } from 'chai'
import { Default } from '../../../src/utils/default'
import { CustomLogger } from '../../../src/utils/custom.logger'
import { Logger, transports } from 'winston'

describe('UTILS: CustomLogger', () => {
    context('startup and configurations.', () => {
        it('should create log directory when instantiating.', async () => {
            if (fs.existsSync(Default.LOG_DIR)) await removeDir(Default.LOG_DIR)
            new CustomLogger()
            assert.equal(fs.existsSync(Default.LOG_DIR), true)
        })

        it('should be return instance Logger when adding new transports.', () => {
            const logger = new CustomLogger()
            const result: Logger = logger.addTransport(new transports.Http())
            assert.isNotNull(result)
        })

        it('should be possible to change the module name.', () => {
            const logger = new CustomLogger()

            assert.equal(logger.moduleName, Default.APP_ID)

            // change module name
            logger.moduleName = 'test.app'

            assert.equal(logger.moduleName, 'test.app')
        })
    })

    context('printing consoles.', () => {
        process.env.NODE_ENV = 'printing_forced'

        context('string message.', () => {
            const logger = new CustomLogger()
            it('should print the error level message on the console.', (done) => {
                const expectedMessage = 'testing logger.error("str")'
                const transport = new transports.Console({
                    log: (info) => {
                        assert.equal(info.level, 'error')
                        assert.equal(info.message, expectedMessage)
                        done()
                    }
                })
                logger.addTransport(transport)
                logger.error(expectedMessage)
            })

            it('should print the warn level message on the console.', (done) => {
                const expectedMessage = 'testing logger.warn("str")'
                const transport = new transports.Console({
                    log: (info) => {
                        assert.equal(info.level, 'warn')
                        assert.equal(info.message, expectedMessage)
                        done()
                    }
                })
                logger.addTransport(transport)
                logger.warn(expectedMessage)
            })

            it('should print the info level message on the console.', (done) => {
                const expectedMessage = 'testing logger.info("str")'
                const transport = new transports.Console({
                    log: (info) => {
                        assert.equal(info.level, 'info')
                        assert.equal(info.message, expectedMessage)
                        done()
                    }
                })
                logger.addTransport(transport)
                logger.info(expectedMessage)
            })

            it('should print the debug level message on the console.', (done) => {
                const expectedMessage = 'testing logger.debug("str")'
                const transport = new transports.Console({
                    log: (info) => {
                        assert.equal(info.level, 'debug')
                        assert.equal(info.message, expectedMessage)
                        done()
                    }
                })
                logger.addTransport(transport)
                logger.debug(expectedMessage)
            })
        })

        context('object error.', () => {
            const logger = new CustomLogger()

            it('should print the error level message from the Error object on the console.', (done) => {
                const expectedMessage = new CustomException('testing logger.error(Error)', 'description...')
                const transport = new transports.Console({
                    log: (info) => {
                        assert.equal(info.level, 'error')
                        assert.equal(
                            info.message, expectedMessage.message
                                .concat(expectedMessage.description ? ` | ${expectedMessage.description}` : '')
                        )
                        assert.deepEqual(info.stack, expectedMessage.stack)
                        done()
                    }
                })
                logger.addTransport(transport)
                logger.error(expectedMessage)
            })

            it('should print the warn level message from the Error object on the console.', (done) => {
                const expectedMessage = new CustomException('testing logger.warn(Error)', 'description...')
                const transport = new transports.Console({
                    log: (info) => {
                        assert.equal(info.level, 'warn')
                        assert.equal(
                            info.message, expectedMessage.message
                                .concat(expectedMessage.description ? ` | ${expectedMessage.description}` : '')
                        )
                        assert.deepEqual(info.stack, expectedMessage.stack)
                        done()
                    }
                })
                logger.addTransport(transport)
                logger.warn(expectedMessage)
            })

            it('should print the info level message from the Error object on the console.', (done) => {
                const expectedMessage = new Error('testing logger.info(Error)')
                const transport = new transports.Console({
                    log: (info) => {
                        assert.equal(info.level, 'info')
                        assert.equal(info.message, expectedMessage.message)
                        assert.deepEqual(info.stack, expectedMessage.stack)
                        done()
                    }
                })
                logger.addTransport(transport)
                logger.info(expectedMessage)
            })

            it('should print the debug level message from the Error object on the console.', (done) => {
                const expectedMessage = new CustomException('testing logger.debug(Error)', 'description...')
                const transport = new transports.Console({
                    log: (info) => {
                        assert.equal(info.level, 'debug')
                        assert.equal(
                            info.message, expectedMessage.message
                                .concat(expectedMessage.description ? ` | ${expectedMessage.description}` : '')
                        )
                        assert.deepEqual(info.stack, expectedMessage.stack)
                        done()
                    }
                })
                logger.addTransport(transport)
                logger.debug(expectedMessage)
            })
        })
    })

    const removeDir = (dirPath): Promise<void> => {
        return new Promise((resolve, reject) => {
            try {
                if (!fs.existsSync(dirPath)) return resolve()
                for (const item of fs.readdirSync(dirPath)) {
                    const filename = path.join(dirPath, item)
                    const stat = fs.statSync(filename)

                    if (stat.isDirectory()) removeDir(filename)
                    else fs.unlinkSync(filename)
                }
                fs.rmdirSync(dirPath)
                resolve()
            } catch (e) {
                reject(e)
            }
        })
    }
})

class CustomException extends Error {
    constructor(message: string, public description?: string) {
        super(message)
        this.description = description
    }
}
