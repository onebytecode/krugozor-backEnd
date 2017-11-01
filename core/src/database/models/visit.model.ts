import * as Mongoose from 'mongoose';
import { Schema, Document }    from 'mongoose';
import { Visitor } from './visitor.model';


export interface IVisitModel extends Document {
    visitorId: Schema.Types.ObjectId;
    startDate: Date;
    endDate?: Date;
    duration?: number
    _id: Schema.Types.ObjectId;
}

interface IVisitQuery {
    visitorId?: Schema.Types.ObjectId;
    _id?: Schema.Types.ObjectId;
}

const VisitSchema = new Schema({
    visitorId: { type: Schema.Types.ObjectId, required: true },
    startDate: { type: Date },
    endDate: { type: Date },
    duration: Number
})

function calculateDuration(startDate, endDate): number {
    const duration = ((endDate.getTime() - startDate.getTime()) / 1000 ) / 60

    return duration;
}

VisitSchema.pre('save', function(next) {
    if (!this.startDate) this.startDate = new Date()
    if (this.endDate) {
        this.duration = calculateDuration(this.startDate, this.endDate);
    }
    next()
})

const VisitModel = Mongoose.model<IVisitModel>('visit', VisitSchema)

export class Visit {

    public static async find(query: IVisitQuery): Promise<IVisitModel> {
        let visit;
        if (query.visitorId) {
            visit = await VisitModel.findOne({ visitorId: query.visitorId });
        } else if (query._id) {
            visit = await VisitModel.findOne({ _id: query._id });
        }
        return visit 
    }

    public static async start(query: IVisitQuery): Promise<IVisitModel> {
        const visitor = await Visitor.find({ _id: query.visitorId })
        const isVisitorExists = visitor !== null 
        if (!isVisitorExists) throw new Error('Visitor does not exist!')
        const visit = await VisitModel.create({ visitorId: query.visitorId })
        
        visitor.currentVisit = visit._id;
        visitor.entryTimestamp = visit.startDate
        await visitor.save()

        return visit 
    }

    public static async stop(query: IVisitQuery): Promise<IVisitModel> {
        const visitor = await Visitor.find({ _id: query.visitorId });
        const currentVisitId = visitor.currentVisit;
        const visit   = await Visit.find({ _id: currentVisitId });
        visit.endDate = new Date()
        const result  = await visit.save()

        visitor.exitTimestamp = visit.endDate
        visitor.currentVisit  = undefined
        visitor.visitsHistory.push(visit._id);
        await visitor.save()

        return result  
    }
}