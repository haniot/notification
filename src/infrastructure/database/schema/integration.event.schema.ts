import Mongoose from 'mongoose'

interface IIntegrationEventModel extends Mongoose.Document {
}

const integrationEventSchema = new Mongoose.Schema({
        __operation: {
            type: String,
            enum: ['publish'],
            required: true
        },
        __routing_key: {
            type: String,
            required: true
        }
    },
    {
        strict: false,
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

export const IntegrationEventRepoModel = Mongoose.model<IIntegrationEventModel>(
    'IntegrationEvent', integrationEventSchema
)
