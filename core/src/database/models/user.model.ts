import * as Mongoose from 'mongoose'
import { Schema, Document }    from 'mongoose'
import { Session } from './session.model'

export interface IUserModel extends Document {
    fname: String
    lname?: String
    patronymic?: String
    gender?: String 
    birthdate?: Date  
    phoneNumber?: String 
    email: String 
    sessionId?: String 
    password?: String 
}

interface IUserQuery {
    email?: String 
    sessionId?: String
}

const UserSchema = new Schema ({
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

UserSchema.pre('save', function(next) {
    if (!this.createdAt) this.createdAt = new Date()
    this.updatedAt = new Date()
    next()
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

    public static async find(user: IUserQuery) : Promise<Document<IUserModel>> {
        try {
            const result = await UserModel.findOne(user)
            return result 
        } catch (e) {
            throw new Error(e)
        }
    }

    public static async update(params: IUserQuery, user: IUserModel): Promise<Document<IUserModel>> {
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

    // it returns session ID
    public static async startSession(userQuery: IUserQuery): Promise<String> {
        try {
            const user = await User.find(userQuery)
            if (!user) return '0'
            const session = await Session.create({ id: user._id })
            user.sessionId = session._id 
            await user.save()
            return session._id.toString() 
        } catch (e) {
            throw new Error(e)
        }
    }
}