import Mongoose from 'mongoose'

interface IEmailModel extends Mongoose.Document {
}

const addressObj = {
    name: { type: String },
    email: {
        type: String,
        required: true
    }
}

const emailSchema = new Mongoose.Schema({
        reply: addressObj,
        to: [addressObj],
        cc: [addressObj],
        bcc: [addressObj],
        subject: {
            type: String,
            required: true
        },
        text: { type: String },
        html: { type: String },
        attachments: [{
            filename: { type: String },
            path: { type: String },
            content_type: { type: String }
        }],
        user_id: {
            type: Mongoose.Schema.Types.ObjectId,
            required: true
        }
    },
    {
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
)

export const EmailRepoModel = Mongoose.model<IEmailModel>('Email', emailSchema)
