import {
    GraphQLString,
    GraphQLObjectType,
    GraphQLNonNull,
    GraphQLBoolean,
    GraphQLList,
    GraphQLInt
} from 'graphql'

import { Room } from '../../../../../database/models/room.model';

const priceObject = new GraphQLObjectType({
    name: 'RoomPrice',
    fields: {
        isFixed: { type: GraphQLBoolean },
        price: { type: GraphQLString }
    }
})

const roomFields = {
    name: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    photos: { type: new GraphQLList(GraphQLString) },
    prices: { type: new GraphQLList(priceObject) }
}

const roomType = new GraphQLObjectType({
    name: 'Room',
    fields: roomFields
});

export const getAllRooms = {
    type: new GraphQLList(roomType),
    args: {},
    resolve: async function() {
        const rooms = await Room.getAll();
        return rooms;
    }
}
