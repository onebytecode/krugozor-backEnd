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
    sessionId: { type: GraphQLString },
    password: { type: GraphQLString },
    entryTimestamp: { type: GraphQLString },
    exitTimestamp: { type: GraphQLString },
    id: { type: GraphQLString }
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
            let result;
            if (email) {
                result = await Visitor.find({ email })
            } else {
                result = await Visitor.find({ sessionId })
            }
            result['id'] = result._id 

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

export const visitorEntry = {
    type: new GraphQLObjectType({
        name: 'VisitorEntryType',
        fields: {
            status: { type: new GraphQLNonNull(GraphQLBoolean) },
            entryTimestamp: { type: GraphQLString }
        }
    }),
    args: {
        sessionId: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve: async function(_, { sessionId }) {
        const result  = { status: false, entryTimestamp: undefined }
        const visitor = await Visitor.find({ sessionId: sessionId })
        const date    = await Visitor.entry({ _id: visitor._id })
        if (date) {
            result.status = true
            result.entryTimestamp = date.toString()
        }

        return result 
    }
}

export const visitorExit = {
    type: new GraphQLObjectType({
        name: 'VisitorExitType',
        fields: {
            status: { type: new GraphQLNonNull(GraphQLBoolean) },
            exitTimestamp: { type: GraphQLString },
            price: { type: GraphQLString }
        }
    }),
    args: {
        sessionId: { type: GraphQLString }
    },
    resolve: async function(_, { sessionId } ) {
        const result  = { status: false, exitTimestamp: undefined, price: undefined }
        const visitor = await Visitor.find({ sessionId: sessionId })
        const date    = await Visitor.exit({ _id: visitor._id })
        if (date) {
            result.status = true 
            result.exitTimestamp = date 
        }

        return result 
    }
}

export const updateVisitor = {
    type: visitorModel,
    args: {

    }
}