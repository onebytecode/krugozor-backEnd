import { VisitModel } from './visit.gql-model';
import {
    GraphQLString,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLBoolean,
    GraphQLList
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
    sessionToken: { type: GraphQLString },
    password: { type: new GraphQLNonNull(GraphQLString) },
    entryTimestamp: { type: GraphQLString },
    exitTimestamp: { type: GraphQLString },
    id: { type: GraphQLString },
    currentVisit: { type: VisitModel },
    visitsHistory: { type: new GraphQLList(VisitModel) }
}

const registerVisitorFields = {
    fname: { type: new GraphQLNonNull(GraphQLString) },
    lname: { type: GraphQLString },
    patronymic: { type: GraphQLString },
    gender: { type: GraphQLString },
    birthdate: { type: GraphQLString },
    email: { type: new GraphQLNonNull(GraphQLString) },
    phoneNumber: { type: new GraphQLNonNull(GraphQLString) },
    password: { type: new GraphQLNonNull(GraphQLString) }
}
const visitorSessionTokenType = new GraphQLObjectType({
    name: 'VisitorSessionToken',
    fields: {
        sessionToken: { type: new GraphQLNonNull(GraphQLString) }
    }
})

export const visitorModel = new GraphQLObjectType({
    name: 'Visitor',
    fields: visitorFields
}) 

export const getVisitor = {
        type: visitorModel,
        args: {
            email: { type: GraphQLString },
            sessionToken: { type: GraphQLString }
        },
        resolve: async function(_, { email, sessionToken }) {
            let result;
            if (email) {
                result = await Visitor.findWithPopulation({ email })
            } else {
                result = await Visitor.findWithPopulation({ sessionToken })
            }
            result['id'] = result._id 

            return result 
        }
}

export const registerNewVisitor = {
    type: visitorSessionTokenType,
    args: registerVisitorFields,
    resolve: async function(_, visitorParams) {
        const visitor = await Visitor.create(visitorParams);
        const sessionToken = await Visitor.startSession({ _id: visitor._id });
        return { sessionToken }
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
            sessionToken: { type: new GraphQLNonNull(GraphQLString) }
        }
    }),
    args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve: async function(_, { email, password }) {
        const sessionToken = await Visitor.startSession({ email, password })
        return { sessionToken }
    }
}

export const visitorLogOut = {
    type: new GraphQLObjectType({
        name: 'VisitorLogOutType',
        fields: { 
            status: { type: new GraphQLNonNull(GraphQLBoolean) }        }
    }),
    args: {
        sessionToken: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve: async function(_, { sessionToken }) {
        const result = await Visitor.stopSession({ sessionToken })
        return { status: true } 
    }
}

export const visitorTerminalTrigger = {
    type: new GraphQLObjectType({
        name: 'TerminalTriggerType',
        fields: {
            isEntered: { type: new GraphQLNonNull(GraphQLBoolean) },
            isExit: { type: new GraphQLNonNull(GraphQLBoolean) }
        }
    }),
    args: {
        sessionToken: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve: async function(_, { sessionToken }) {
        const visitor = await Visitor.find({ sessionToken })
        if (visitor.currentVisit) {
            await Visitor.exit({ sessionToken })
            return {
                isEntered: false,
                isExit: true 
            }
        } else {
            await Visitor.entry({ sessionToken })
            return {
                isEntered: true,
                isExit: false 
            }
        }
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
        sessionToken: { type: new GraphQLNonNull(GraphQLString) }
    },
    resolve: async function(_, { sessionToken }) {
        const result  = { status: false, entryTimestamp: undefined }
        const visitor = await Visitor.find({ sessionToken: sessionToken })
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
        sessionToken: { type: GraphQLString }
    },
    resolve: async function(_, { sessionToken } ) {
        const result  = { status: false, exitTimestamp: undefined, price: undefined }
        const visitor = await Visitor.find({ sessionToken: sessionToken })
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