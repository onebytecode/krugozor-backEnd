import {
    GraphQLString,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLBoolean
} from 'graphql'

import { User } from '../../../../../database/models/user.model'

const userFields = {
    fname: { type: new GraphQLNonNull(GraphQLString) },
    lname: { type: GraphQLString },
    patronymic: { type: GraphQLString },
    gender: { type: GraphQLString },
    birthdate: { type: GraphQLString },
    email: { type: new GraphQLNonNull(GraphQLString) },
    phoneNumber: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLString }
}
export const userModel = new GraphQLObjectType({
    name: 'User',
    fields: userFields
}) 

export const getUser = {
        type: userModel,
        args: {
            email: { type: GraphQLString },
            sessionId: { type: GraphQLString }
        },
        resolve: async function(_, { email, sessionId }) {
            const result = await User.find({ email, sessionId })
            return result 
        }
}

export const registerNewVisitor = {
    type: userModel,
    args: userFields,
    resolve: async function(_, userParams) {
        const result = await User.create(userParams)
        return result 
    }
}

export const visitorExists = {
    type: new GraphQLObjectType({
        name: 'ExistsUserType',
        fields: {
            exists: { type: new GraphQLNonNull(GraphQLString) }
        }
    }),
    args: {
        email: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve: async function(_, { email }) {
        const user = await User.find({ email })
        const result = user !== null 
        return { exists: result }
    }
}

export const userLogIn = {
    type: new GraphQLObjectType({
        name: 'UserLoginType',
        fields: {
            sessionId: { type: new GraphQLNonNull(GraphQLString) }
        }
    }),
    args: {
        email: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve: async function(_, { email }) {
        const sessionId = await User.startSession({ email })
        return { sessionId }
    }
}

export const userLogOut = {
    type: new GraphQLObjectType({
        name: 'UserLogOutType',
        fields: { 
            sessionId: { type: new GraphQLNonNull(GraphQLString) }
        }
    }),
    args: {
        email: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve: async function(_, { email }) {
        const sessionId = await User.stopSession({ email })
        return { sessionId } 
    }
}

export const updateUser = {
    type: userModel,
    args: {

    }
}