import Mongoose from 'mongoose'

interface IPushNotificationModel extends Mongoose.Document {
}

const schema: any = {
    type: String,
    keep_it: String,
    to: [String],
    message: {
        type: { type: String },
        pt: Object,
        eng: Object
    },
    is_read: String
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

export const PushNotificationRepoModel =
    Mongoose.model<IPushNotificationModel>('PushNotification', new Mongoose.Schema(schema, options))
