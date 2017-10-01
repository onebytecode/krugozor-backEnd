import * as Mongoose from 'mongoose'
import { Schema, Document }    from 'mongoose'

export interface IUserModel extends Document {
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

    public static async create(user: IUserModel): Promise<Document<IUserModel>> {
        try {
            const result = await UserModel.create(user)
            return result
        } catch (e) {
            throw new Error(e)
        }
    } 

    public static async find(user: IUserModel) : Promise<Document<IUserModel>> {
        try {
            const result = await UserModel.findOne(user)
            return result 
        } catch (e) {
            throw new Error(e)
        }
    }

    public static async update(params: IUserModel, user: IUserModel): Promise<Document<IUserModel>> {
        try {
            const __user = await User.find(params)
            if (!__user) return 
            Object.keys(user).forEach(k => {
                if (k) {
                    __user[k] = user[k]
                }
            })
            const u = await __user.save()
            return u
        } catch (e) {
            throw new Error(e)
        }
    }

    public static async delete(user: IUserModel): Promise<Document<IUserModel>> {
        try {
            const result = UserModel.findOneAndRemove(user)
            return result 
        } catch (e) {
            throw new Error(e)
        }
    }
}