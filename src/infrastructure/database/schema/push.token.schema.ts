import Mongoose from 'mongoose'

interface IPushTokenModel extends Mongoose.Document {
}

const schema: any = {
    user_id: String,
    client_type: String,
    token: String
}

const options: any = {
    timestamps: { createdAt: 'created_at', updatedAt: false },
    toJSON: {
        transform: (doc, ret) => {
            ret.id = ret._id
            delete ret._id
            delete ret.__v
            return ret
        }
    }
}

export const PushTokenRepoModel = Mongoose.model<IPushTokenModel>('PushToken', new Mongoose.Schema(schema, options))
