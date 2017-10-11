import * as Mongoose from 'mongoose'
import { Schema, Document }    from 'mongoose'
import { Session } from './session.model'

export interface IVisitorModel extends Document {
    fname: String
    lname?: String
    patronymic?: String
    gender?: String 
    birthdate?: Date  
    phoneNumber: String 
    email: String 
    sessionId?: String 
    password?: String 
}

interface IVisitorQuery {
    email?: String 
    sessionId?: String
}

const VisitorSchema = new Schema ({
    fname: { type: String, required: true },
    lname: String,
    patronymic: String,
    gender: String,
    sessionId: { type: String, ref: 'session' },
    birthdate: Date,
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    createdAt: { type: Date },
    updatedAt: { type: Date }
})

VisitorSchema.pre('save', function(next) {
    if (!this.createdAt) this.createdAt = new Date()
    this.updatedAt = new Date()
    next()
})


export const VisitorModel = Mongoose.model<IVisitorModel>('visitor', VisitorSchema)

export class Visitor {

    public static async create(visitor: IVisitorModel): Promise<Document<IVisitorModel>> {
        try {
            const result = await VisitorModel.create(visitor)
            return result
        } catch (e) {
            throw new Error(e)
        }
    } 

    public static async find(visitor: IVisitorQuery) : Promise<Document<IVisitorModel>> {
        try {
            const result = await VisitorModel.findOne(visitor)
            return result 
        } catch (e) {
            throw new Error(e)
        }
    }

    public static async update(params: IVisitorQuery, visitor: IVisitorModel): Promise<Document<IVisitorModel>> {
        try {
            const __visitor = await Visitor.find(params)
            if (!__visitor) return 
            Object.keys(visitor).forEach(k => {
                if (k) {
                    __visitor[k] = visitor[k]
                }
            })
            const u = await __visitor.save()
            return u
        } catch (e) {
            throw new Error(e)
        }
    }

    public static async delete(visitor: IVisitorModel): Promise<Document<IVisitorModel>> {
        try {
            const result = VisitorModel.findOneAndRemove(visitor)
            return result 
        } catch (e) {
            throw new Error(e)
        }
    }

    // it returns session ID
    public static async startSession(visitorQuery: IVisitorQuery): Promise<String> {
        try {
            const visitor = await Visitor.find(visitorQuery)
            if (!visitor) return '0'
            const session = await Session.create({ id: visitor._id })
            visitor.sessionId = session._id 
            await visitor.save()
            return session._id.toString() 
        } catch (e) {
            throw new Error(e)
        }
    }

    public static async stopSession(visitorQuery: IVisitorQuery): Promise<String> {
        try {
            const visitor = await Visitor.find(visitorQuery)
            const session = await Session.delete({ id: visitor._id })
            return session._id.toString() 
        } catch (e) {
            throw new Error(e)
        }
    }
}