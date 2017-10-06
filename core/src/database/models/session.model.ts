import * as Mongoose from 'mongoose' 
import { Schema, Document } from 'mongoose'


export interface ISessionModel {
    id: string 
}

const SessionSchema = new Schema({
    id: { type: String, required: true },
    createdAt: Date,
    updatedAt: Date 
})

SessionSchema.pre('save', function(next) {
    if (!this.createdAt) this.createdAt = new Date()
    this.updatedAt = new Date()
    next()
})

export const SessionModel = Mongoose.model<ISessionModel>('session', SessionSchema)

export class Session {
    public static async create(session: ISessionModel) {
        try {
            const result = await SessionModel.create(session)
            return result
        } catch(e) {
            throw new Error(e)
        }
    }

    public static async find(session: ISessionModel) {
        try {
            const result = await SessionModel.find(session)
            return result
        } catch (e) {
            throw new Error(e)
        }
    }

    public static async update() {

    }

    public static async delete(session: ISessionModel) {
        try {
            const result = await SessionModel.findOneAndRemove(session)
            return result 
        } catch (e) {
            throw new Error(e)
        }
    }
}