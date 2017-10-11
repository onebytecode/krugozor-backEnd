import {
    GraphQLString,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLBoolean
} from 'graphql'

import { Visitor } from '../../../../../database/models/visitor.model'

const visitorFields = {
    fname: { type: new GraphQLNonNull(GraphQLString) },
    lname: { type: GraphQLString },
    patronymic: { type: GraphQLString },
    gender: { type: GraphQLString },
    birthdate: { type: GraphQLString },
    email: { type: new GraphQLNonNull(GraphQLString) },
    phoneNumber: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLString }
}
export const visitorModel = new GraphQLObjectType({
    name: 'Visitor',
    fields: visitorFields
}) 

export const getVisitor = {
        type: visitorModel,
        args: {
            email: { type: GraphQLString },
            sessionId: { type: GraphQLString }
        },
        resolve: async function(_, { email, sessionId }) {
            const result = await Visitor.find({ email, sessionId })
            return result 
        }
}

export const registerNewVisitor = {
    type: visitorModel,
    args: visitorFields,
    resolve: async function(_, visitorParams) {
        const result = await Visitor.create(visitorParams)
        return result 
    }
}

export const visitorExists = {
    type: new GraphQLObjectType({
        name: 'ExistsVisitorType',
        fields: {
            exists: { type: new GraphQLNonNull(GraphQLString) }
        }
    }),
    args: {
        email: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve: async function(_, { email }) {
        const visitor = await Visitor.find({ email })
        const result = visitor !== null 
        return { exists: result }
    }
}

export const visitorLogIn = {
    type: new GraphQLObjectType({
        name: 'VisitorLoginType',
        fields: {
            sessionId: { type: new GraphQLNonNull(GraphQLString) }
        }
    }),
    args: {
        email: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve: async function(_, { email }) {
        const sessionId = await Visitor.startSession({ email })
        return { sessionId }
    }
}

export const visitorLogOut = {
    type: new GraphQLObjectType({
        name: 'VisitorLogOutType',
        fields: { 
            sessionId: { type: new GraphQLNonNull(GraphQLString) }
        }
    }),
    args: {
        email: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve: async function(_, { email }) {
        const sessionId = await Visitor.stopSession({ email })
        return { sessionId } 
    }
}

export const updateVisitor = {
    type: visitorModel,
    args: {

    }
}