import Mongoose from 'mongoose'
import { ChoiceTypes } from '../../../application/domain/utils/choice.types'

interface IPushModel extends Mongoose.Document {
}

const pushSchema: any = {
    type: String,
    keep_it: String,
    to: [String],
    message: {
        type: { type: String },
        pt: Object,
        eng: Object
    },
    is_read: {
        type: String,
        default: ChoiceTypes.NO
    }
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

export const PushRepoModel = Mongoose.model<IPushModel>('Push', new Mongoose.Schema(pushSchema, options))
