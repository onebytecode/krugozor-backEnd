import * as graphql from 'graphql'
import * as gqlHTTP from 'express-graphql'
import { Router }   from 'express'

import {
    getVisitor,
    registerNewVisitor,
    visitorLogIn,
    visitorLogOut,
    visitorTerminalTrigger
} from './gql-models/visitor.gql-model';

import { 
    getVisit 
} from './gql-models/visit.gql-model';

import { getAllRooms } from './gql-models/room.gql-model';

import { 
    GraphQLObjectType, 
    GraphQLSchema,
    GraphQLString,
    GraphQLInputObjectType,
    GraphQLInputType
    } from 'graphql'

export function Api (): Router {
    const router = Router()

    const queryType = new GraphQLObjectType({
        name: 'Query',
        fields: {
            getVisitor,
            getAllRooms
        }
    })

    const mutationType = new GraphQLObjectType({
        name: 'Mutation',
        fields: {
            registerNewVisitor,
            visitorLogIn,
            visitorLogOut,
            visitorTerminalTrigger
        }
    })

    const schema = new GraphQLSchema({ query: queryType, mutation: mutationType })

    router.use('/', gqlHTTP({
        schema: schema,
        graphiql: true 
    }))

    return router 
}