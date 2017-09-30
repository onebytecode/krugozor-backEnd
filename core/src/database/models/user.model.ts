import * as Mongoose from 'mongoose'
import { Schema }    from 'mongoose'

export interface IUserModel {
    name?: String 
    phone?: String 
    password?: String 
}

const UserSchema = new Schema ({
    name: String,
    phone: String,
    password: String 
})

export const UserModel = Mongoose.model<IUserModel>('user', UserSchema)

export class User {

    public static async create(user: IUserModel): Promise<IUserModel> {
        try {
            const result = await UserModel.create(user)
            return result
        } catch (e) {
            throw new Error(e)
        }
    } 

    public static async find(user: IUserModel) : Promise<IUserModel> {
        try {
            const result = await UserModel.findOne(user)
            return result 
        } catch (e) {
            throw new Error(e)
        }
    }
}