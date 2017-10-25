import * as chai from 'chai';
import * as chaiHttp from '../../../../../../node_modules/chai-http';
import { expect } from 'chai';
import { Room } from '../../../../../database/models/room.model';
import { clearDb } from 'mongo-interlude';
import * as Mongoose from 'mongoose';

chai.use(chaiHttp);

describe('Room gql-model', () => {
    const host = 'localhost:8080'

    afterEach(async () => {
        await clearDb({
            mongoose: Mongoose,
            silent: true
        });
    })

    it ('should get all rooms', async () => {
        try {
            await Room.create({ name: 'White', description: 'In the white room...' })
            await Room.create({ name: 'Black', description: 'In the black room...' })
            await Room.create({ name: 'Yellow', description: 'In the yellow room...' })
            const queryString = `
                {
                    getAllRooms {
                        name
                        description
                    }
                }
            `
            const result = await chai.request(host).get('/gql').send({ query: queryString })
            const { body: { data: { getAllRooms } } } = result;

            expect(getAllRooms).to.be.an('array').with.lengthOf(3);
            expect(getAllRooms[0].name).to.equal('White');
            expect(getAllRooms[1].name).to.equal('Black');
            expect(getAllRooms[2].name).to.equal('Yellow');
        } catch (e) {
            throw new Error(e);
        }
    })

    it ('should get 0 rooms', async () => {
        try {
            const queryString = `
                {
                    getAllRooms {
                        name
                        description
                    }
                }
            `
            const result = await chai.request(host).get('/gql').send({ query: queryString });
            const { body: { data: { getAllRooms } } }  = result;
            expect(getAllRooms).to.be.an('array').with.lengthOf(0);
        } catch (e) {
            throw new Error(e);
        }
    })
})
