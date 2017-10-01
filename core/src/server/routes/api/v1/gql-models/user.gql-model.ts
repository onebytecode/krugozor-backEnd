import {
    GraphQLString,
    GraphQLObjectType
} from 'graphql'

export function UserModel(): GraphQLObjectType {
    const userModel = new GraphQLObjectType({
        name: 'User',
        fields: {
            name: { type: GraphQLString },
            phone: { type: GraphQLString },
            password: { type: GraphQLString }
        }
    })

    return userModel
}  