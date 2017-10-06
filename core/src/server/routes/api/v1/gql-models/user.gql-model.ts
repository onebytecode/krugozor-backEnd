import {
    GraphQLString,
    GraphQLObjectType
} from 'graphql'

import { User } from '../../../../../database/models/user.model'

export const userModel = new GraphQLObjectType({
    name: 'User',
    fields: {
        name: { type: GraphQLString },
        phone: { type: GraphQLString },
        password: { type: GraphQLString }
    }
}) 

export const getUser = {
        type: userModel,
        args: { name: { type: GraphQLString } },
        resolve: async function(_, { name }) {
            const result = await User.find({ name })
            return result 
        }
}

export const createUser = {
    type: userModel,
    args: {
        name: { type: GraphQLString },
        phone: { type: GraphQLString },
        password: { type: GraphQLString }
    },
    resolve: async function(_, userParams) {
        const result = await User.create(userParams)
        return result 
    }
}

export const updateUser = {
    type: userModel,
    args: {

    }
}