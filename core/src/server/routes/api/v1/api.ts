import * as graphql from 'graphql'
import * as gqlHTTP from 'express-graphql'
import { Router }   from 'express'

import { UserModel } from './gql-models/user.gql-model'

import { 
            GraphQLObjectType, 
            GraphQLSchema,
            GraphQLString
         } from 'graphql'

export function Api (): Router {
    const router = Router()

    const queryType = new GraphQLObjectType({
        name: 'Query',
        fields: {
            user: {
                type: UserModel(),
                args: { name: { type: GraphQLString } },
                resolve: function(_, { name }) {
                    return {
                        name: name,
                        phone: '8-99-88-77-40-8',
                        password: "superpass"
                    }
                }
            }
        }
    })

    const schema = new GraphQLSchema({ query: queryType })

    router.use('/', gqlHTTP({
        schema: schema,
        graphiql: true 
    }))


    return router 
}