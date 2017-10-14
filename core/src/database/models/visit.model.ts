import * as Mongoose from 'mongoose';
import { Schema, Document }    from 'mongoose';
import { Visitor } from './visitor.model';

interface Duration {
    hours?: number;
    minutes?: number;
    seconds?: number;
}
export interface IVisitModel extends Document {
    visitorId: Schema.Types.ObjectId;
    startedAt?: Date;
    endedAt?: Date;
    duration?: Duration
    _id: Schema.Types.ObjectId;
}

interface IVisitQuery {
    visitorId: number;
}

const VisitSchema = new Schema({
    visitorId: { type: Schema.Types.ObjectId, required: true },
    startedAt: { type: Date },
    endedAt: { type: Date },
    duration: {
        hours: Number,
        minutes: Number,
        seconds: Number
    }
})

function calculateDuration(startDate, endDate): Duration {
    const duration = {
        hours: 0,
        minutes: 0,
        seconds: 0
    }
    const sDate = new Date(startDate).getTime();
    const eDate = new Date(endDate).getTime();
    const diff  = sDate - eDate;
    const seconds = diff/1000;
    const minutes = seconds/60;
    const hours = minutes/60;
    duration.seconds = seconds;
    duration.minutes = minutes;
    duration.hours = hours;

    return duration;
}

VisitSchema.pre('save', function(next) {
    if (!this.startedAt) this.startedAt = new Date()
    if (this.endedAt) {
        this.duration = calculateDuration(this.startedAt, this.endedAt);
    }
    next()
})

const VisitModel = Mongoose.model<IVisitModel>('visit', VisitSchema)

export class Visit {

    public static async find(query: IVisitQuery): Promise<IVisitModel> {
        const visit = await VisitModel.findOne(query)
        return visit 
    }

    public static async start(query: IVisitQuery): Promise<IVisitModel> {
        const visitor = await Visitor.find({ _id: query.visitorId })
        const isVisitorExists = visitor !== null 
        if (!isVisitorExists) throw new Error('Visitor does not exist!')
        const visit = await VisitModel.create({ visitorId: query.visitorId })
        
        visitor.currentVisit = visit._id 
        visitor.entryTimestamp = visit.startedAt
        visitor.visits.push(visit._id)
        await visitor.save()

        return visit 
    }

    public static async stop(query: IVisitQuery): Promise<IVisitModel> {
        const visit   = await VisitModel.findOne({ visitorId: query.visitorId })
        visit.endedAt = new Date()
        const result  = await visit.save()

        const visitor = await Visitor.find({ _id: query.visitorId })
        visitor.exitTimestamp = visit.endedAt
        visitor.currentVisit  = undefined
        await visitor.save()

        return result  
    }
}