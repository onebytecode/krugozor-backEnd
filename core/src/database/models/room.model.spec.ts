import { expect } from 'chai';
import { Room } from './room.model';
import { clearDb } from 'mongo-interlude';
import * as Mongoose from 'mongoose';

describe('Room model', () => {
    afterEach(async () => {
        await clearDb({
            mongoose: Mongoose,
            silent: true 
        })
    })

    it ('should find all rooms', async () => {
        try {
            await Room.create({ name: 'White', description: 'In the white room...' })
            await Room.create({ name: 'Black', description: 'In the black room...' })
            await Room.create({ name: 'Yellow', description: 'In the yellow room...' })
    
            const rooms = await Room.getAll();
    
            expect(rooms.length).to.equal(3);
            expect(rooms[0].name).to.equal('White');
            expect(rooms[0].description).to.equal('In the white room...');
        } catch (e) {
            throw new Error(e);
        }
    })
})
