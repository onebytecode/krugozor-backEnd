import {
    GraphQLString,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLBoolean
} from 'graphql'

import { Visit } from '../../../../../database/models/visit.model'

const durationObject = new GraphQLObjectType({
    name: 'DurationType',
    fields: {
        seconds: { type: GraphQLString },
        minutes: { type: GraphQLString },
        hours: { type: GraphQLString }
    }
})
const visitFields = {
    visitorId: { type: GraphQLString },
    startedAt: { type: GraphQLString },
    endedAt: { type: GraphQLString },
    duration: { type: GraphQLString }
}

export const VisitModel = new GraphQLObjectType({
    name: 'Visit',
    fields: visitFields
})

export const getVisit = {
    type: VisitModel,
    args: {
        visitorId: { type: GraphQLString }
    },
    resolve: async function(_, { visitorId }) {
        const visit = await Visit.find({ visitorId })
        return visit 
    }
}