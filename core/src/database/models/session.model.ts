import * as Mongoose from 'mongoose' 
import { Schema, Document } from 'mongoose'

export interface SessionType extends Document {
    visitorId: Schema.Types.ObjectId;
    created: Date;
    updated: Date;
}

const SessionSchema = new Schema({
    visitorId: { type: Schema.Types.ObjectId, ref: 'visitor' },
    created: Date,
    updated: Date 
})

SessionSchema.pre('save', function(next) {
    if (!this.createdAt) this.created = new Date()
    this.updated = new Date()
    next()
})

export const SessionModel = Mongoose.model('session', SessionSchema)

export class Session {
    public static async create(visitorId: Schema.Types.ObjectId) {
        try {
            const result = await SessionModel.create({ visitorId })
            return result
        } catch(e) {
            throw new Error(e)
        }
    }

    public static async find(sessionToken: Schema.Types.ObjectId): Promise<SessionType> {
        try {
            const result = await SessionModel.findOne({ _id: sessionToken });
            if (result === null) throw new Error('Session does not exist!');
            return <SessionType>result;
        } catch (e) {
            throw new Error(e)
        }
    }

    public static async update() {

    }

    public static async delete(sessionToken: Schema.Types.ObjectId) {
        try {
            const result = await SessionModel.findOneAndRemove(sessionToken)
            return result 
        } catch (e) {
            throw new Error(e)
        }
    }
}