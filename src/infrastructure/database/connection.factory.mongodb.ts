import { injectable } from 'inversify'
import mongoose, { Connection, Mongoose } from 'mongoose'
import { IConnectionFactory, IDBOptions } from '../port/connection.factory.interface'

@injectable()
export class ConnectionFactoryMongoDB implements IConnectionFactory {
    private readonly options = {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    }

    /**
     * Create connection with MongoDB.
     *
     * @param uri This specification defines an URI scheme.
     * For more details see: {@link https://docs.mongodb.com/manual/reference/connection-string/}
     * @param options {IDBOptions} Connection setup Options.
     */
    public createConnection(uri: string, options?: IDBOptions): Promise<Connection> {
        // this.options.reconnectTries = (retries === 0) ? Number.MAX_SAFE_INTEGER : retries
        // this.options.reconnectInterval = interval

        return new Promise<Connection>((resolve, reject) => {
            mongoose.connect(uri, this.options)
                .then((result: Mongoose) => resolve(result.connection))
                .catch(err => reject(err))
        })
    }
}
