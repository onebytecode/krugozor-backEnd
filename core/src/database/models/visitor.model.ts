import * as Mongoose from 'mongoose';
import { Schema, Document }    from 'mongoose';
import { Session } from './session.model';
import { Visit } from './visit.model';

export interface IVisitorModel extends Document {
    fname: string
    lname?: string
    patronymic?: string
    gender?: string 
    birthdate?: Date  
    phoneNumber: string 
    email: string 
    sessionToken?: Schema.Types.ObjectId 
    password?: string
    currentVisit?: Schema.Types.ObjectId
    visits?: Array<Schema.Types.ObjectId>
    entryTimestamp?: Date 
    exitTimestamp?: Date
}

interface IUpdateVisitorQuery {
    fname?: string
    lname?: string
    patronymic?: string
    gender?: string 
    birthdate?: Date  
    phoneNumber?: string 
    email?: string 
    sessionToken?: Schema.Types.ObjectId 
    password?: string,
    currentVisit?: Schema.Types.ObjectId
    visits?: Array<Schema.Types.ObjectId>
    entryTimestamp?: Date 
    exitTimestamp?: Date 
}

interface IVisitorQuery {
    _id?: Number  
    email?: string 
    sessionToken?: string
}

const VisitorSchema = new Schema ({
    fname: { type: String, required: '{PATH} is required!' },
    lname: String,
    patronymic: String,
    gender: String,
    sessionToken: { type: Schema.Types.ObjectId, ref: 'session' },
    birthdate: Date,
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    createdAt: { type: Date },
    updatedAt: { type: Date },
    visits: [{ type: Schema.Types.ObjectId, ref: 'visit' }],
    currentVisit: { type: Schema.Types.ObjectId, ref: 'visit' },
    entryTimestamp: { type: Date },
    exitTimestamp: { type: Date }
})

VisitorSchema.pre('save', function(next) {
    if (!this.createdAt) this.createdAt = new Date()
    this.updatedAt = new Date()
    next()
})


export const VisitorModel = Mongoose.model('visitor', VisitorSchema)

export class Visitor {

    public static async create(visitor: IUpdateVisitorQuery): Promise<IVisitorModel> {
        try {
            const result = await VisitorModel.create(visitor)
            return <IVisitorModel>result
        } catch (e) {
            switch (e.code) {
                case 11000: throw new Error('Visitor already exists!'); 
            }
            throw new Error(e)
        }
    } 

    public static async find(visitor: IVisitorQuery) : Promise<IVisitorModel> {
        try {
            const result = await VisitorModel.findOne(visitor)
            if (result === null) throw new Error('Visitor does not exists!');
            return <IVisitorModel>result 
        } catch (e) {
            throw new Error(e)
        }
    }

    public static async update(params: IVisitorQuery, visitor: IUpdateVisitorQuery): Promise<IVisitorModel> {
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

    public static async delete(visitor: IVisitorModel): Promise<IVisitorModel> {
        try {
            const result = await VisitorModel.findOneAndRemove(visitor)
            return <IVisitorModel>result 
        } catch (e) {
            throw new Error(e)
        }
    }

    // it returns session ID
    public static async startSession(visitorQuery: IVisitorQuery): Promise<string> {
        try {
            const visitor = await Visitor.find(visitorQuery)
            if (visitor.sessionToken) throw new Error('Visitor already have active session!');
            const session = await Session.create({ id: visitor._id })
            visitor.sessionToken = session._id 
            await visitor.save()
            return session._id
        } catch (e) {
            throw new Error(e)
        }
    }

    public static async stopSession(visitorQuery: IVisitorQuery): Promise<string> {
        try {
            const visitor = await Visitor.find(visitorQuery)
            const session = await Session.delete({ id: visitor._id })
            visitor.sessionToken = undefined;
            await visitor.save()
            return session._id
        } catch (e) {
            throw new Error(e)
        }
    }

    public static async exists(visitorQuery: IVisitorQuery): Promise<boolean> {
        try {
            const visitor = await Visitor.find(visitorQuery)
            return visitor !== null
        } catch (e) {
            return false;
        }
    }

    public static async entry(visitorQuery: IVisitorQuery): Promise<Date> {
        const visitor = await Visitor.find(visitorQuery)
        if (visitor === null) throw new Error('Visitor does not exist!')
        if (visitor.currentVisit) throw new Error('Visitor already entered!')
        const visit = await Visit.start({ visitorId: visitor._id })
        if (visit === null) throw new Error('Cannot create visit model!')
        return visit.startDate 
    }

    public static async exit(visitorQuery: IVisitorQuery): Promise<Date> {
        const visitor = await Visitor.find(visitorQuery)
        if (!visitor.currentVisit) throw new Error('Visitor does not enter anticafe!')
        const result = await Visit.stop({ visitorId: visitor._id })
        return result.endDate
    }
}