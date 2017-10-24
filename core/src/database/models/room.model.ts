import * as Mongoose from 'mongoose' 
import { Schema, Document } from 'mongoose'

export interface PriceInterface {
    isFixed: boolean
    price: number 
}
interface RoomSchemaInterface {
    name: String
    description: String
    photos?: Array<String>
    prices?: Array<PriceInterface>
}
const roomSchema = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    photos: [{ type: String }],
    prices: [
        {
            isFixed: { type: Boolean, required: true },
            price: { type: Number, required: true }
        }
    ]
})

const RoomModel = Mongoose.model('room', roomSchema)

export class Room {
    public static async create(params: RoomSchemaInterface) {
        const result = await RoomModel.create(params)
        return result 
    }

    public static async find(_id: Schema.Types.ObjectId) {
        const result = await RoomModel.findOne({ _id });
        return result;
    }

    public static async update(_id: Schema.Types.ObjectId, params: RoomSchemaInterface) {
        const result = await RoomModel.findOneAndUpdate({ _id }, params, {
            passRawResult: true
        });
        return result;
    }

    public static async getAll() {
        const result = await RoomModel.find();
        return result;
    }
}