import 'mocha'
import * as Mongoose from 'mongoose'
import { expect } from 'chai'
import { clearDb } from 'mongo-interlude'

const dbUri: string = require('../config').uri.test 

import { User, IUserModel } from './user.model'

describe('User model', () => {
    beforeEach( async () => {
        if (Mongoose.connections[0].host) return 
        await Mongoose.connect(dbUri)
    })

    afterEach(async () => {
        await clearDb({ mongoose: Mongoose })
    })

    it ('should create User model in database', async () => {
        const user : IUserModel = await User.create({
            name: "Michael Jackson",
            phone: "8-999-777-66-55",
            password: "superpass"
        })

        expect(user.name).to.be.equal('Michael Jackson')
        expect(user.phone).to.be.equal('8-999-777-66-55')
        expect(user.password).to.be.equal('superpass')
    })

    it ('should find User', async () => {
        await User.create({
            name: "Michael Jackson",
            phone: "8-999-777-66-55",
            password: "superpass"
        })

        const result = await User.find({ name: "Michael Jackson" })

        expect(result.name).to.be.equal("Michael Jackson")
        expect(result.phone).to.be.equal("8-999-777-66-55")
        expect(result.password).to.be.equal("superpass")
    })
})