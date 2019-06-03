import { injectable } from 'inversify'
import mongoose, { Connection, Mongoose } from 'mongoose'
import { IConnectionFactory } from '../port/connection.factory.interface'
import { Default } from '../../utils/default'

@injectable()
export class ConnectionFactoryMongoDB implements IConnectionFactory {
    private readonly options = {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        bufferMaxEntries: 0,
        reconnectTries: Number.MAX_SAFE_INTEGER,
        reconnectInterval: 1500
    }

    /**
     * Create connection with MongoDB.
     *
     * @param retries
     * @param interval
     */
    public createConnection(retries: number, interval: number): Promise<Connection> {
        this.options.reconnectTries = (retries === 0) ? Number.MAX_SAFE_INTEGER : retries
        this.options.reconnectInterval = interval

        return new Promise<Connection>((resolve, reject) => {
            mongoose.connect(this.getDBUri(), this.options)
                .then((result: Mongoose) => resolve(result.connection))
                .catch(err => reject(err))
        })
    }

    /**
     * Retrieve the URI for connection to MongoDB.
     *
     * @return {string}
     */
    private getDBUri(): string {
        if (process.env.NODE_ENV && process.env.NODE_ENV === 'test') {
            return process.env.MONGODB_URI_TEST || Default.MONGODB_URI_TEST
        }
        return process.env.MONGODB_URI || Default.MONGODB_URI
    }
}
