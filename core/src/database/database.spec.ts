import 'mocha'
import { expect } from 'chai'
import { Database } from './database'

describe('Database', () => {
    beforeEach(() => {
        this.db = new Database('test')
    })

    it ('should get mongoose with connection to test database', async () => {
        const db = new Database('test')
        const result = await db.getMongoose()
        expect(result.connections[0].host).to.be.not.null
    })
})