import 'mocha'
import { expect } from 'chai'
import { Database } from './database'

describe('Database', () => {
    beforeEach(() => {
        this.db = new Database('test')
    })

    it ('should get mongoose with connection to test database', async () => {
        try {
            const db = new Database('test')
            const result = await db.getMongoose()
            expect(result.connection).to.be.not.null
        } catch (e) {
            throw new Error(e);
        } 
    })
})