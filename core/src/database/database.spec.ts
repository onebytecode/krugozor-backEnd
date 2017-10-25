import 'mocha'
import { expect } from 'chai'
import { Database } from './database'

describe('Database', () => {

    it ('should get mongoose with connection to test database', async () => {
        try {
            const db = new Database('test')
            const result = await db.getMongoose()
            expect(result.connection.readyState).to.equal(1);
        } catch (e) {
            throw new Error(e);
        } 
    })
})