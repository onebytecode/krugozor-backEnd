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
    prices?: PriceInterface
}
const roomSchema = {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    photos: [{ type: String }],
    prices: [
        {
            type: {
                isFixed: { type: Boolean, required: true },
                price: { type: Number, required: true }
            }
        }
    ]
}

const RoomModel = Mongoose.model('room', roomSchema)

export class Room {
    public static async create(params: RoomSchemaInterface) {
        const result = await RoomModel.create(params)
        return result 
    }

    public static async find() {

    }
}