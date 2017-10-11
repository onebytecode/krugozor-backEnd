import * as graphql from 'graphql'
import * as gqlHTTP from 'express-graphql'
import { Router }   from 'express'

import {
    getVisitor,
    registerNewVisitor,
    visitorLogIn,
    visitorLogOut
} from './gql-models/visitor.gql-model'

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
            getVisitor
        }
    })

    const mutationType = new GraphQLObjectType({
        name: 'Mutation',
        fields: {
            registerNewVisitor,
            visitorLogIn,
            visitorLogOut
        }
    })

    const schema = new GraphQLSchema({ query: queryType, mutation: mutationType })

    router.use('/', gqlHTTP({
        schema: schema,
        graphiql: true 
    }))


    return router 
}