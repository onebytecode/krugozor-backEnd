import * as graphql from 'graphql'
import * as gqlHTTP from 'express-graphql'
import { Router }   from 'express'
import { User }     from '../../../../database/models/user.model'

import { UserModel } from './gql-models/user.gql-model'

import { 
            GraphQLObjectType, 
            GraphQLSchema,
            GraphQLString,
            GraphQLInputObjectType,
            GraphQLInputType
         } from 'graphql'

export function Api (): Router {
    const router = Router()
    const userModelType = UserModel()

    const queryType = new GraphQLObjectType({
        name: 'Query',
        fields: {
            getUser: {
                type: userModelType,
                args: { name: { type: GraphQLString } },
                resolve: async function(_, { name }) {
                    const result = await User.find({ name })
                    return result 
                }
            }
        }
    })

    const mutationType = new GraphQLObjectType({
        name: 'Mutation',
        fields: {
            setUser: {
                type: userModelType,
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
        }
    })

    const schema = new GraphQLSchema({ query: queryType, mutation: mutationType })

    router.use('/', gqlHTTP({
        schema: schema,
        graphiql: true 
    }))


    return router 
}