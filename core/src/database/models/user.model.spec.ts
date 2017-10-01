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
        await clearDb({ mongoose: Mongoose, silent: true })
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

    it ('should update user', async () => {
        await User.create({
            name: "Michael Jackson",
            phone: "8-999-777-66-55",
            password: "superpass"
        })

        await User.update({ name: "Michael Jackson" }, { name: "Aerosmith" })

        const user = await User.find({ name: "Aerosmith" })

        expect(user.name).to.be.equal('Aerosmith')
        expect(user.phone).to.be.equal("8-999-777-66-55")
        expect(user.password).to.be.equal("superpass")
    })

    it ('should delete user', async () => {
        await User.create({
            name: "Michael Jackson",
            phone: "8-999-777-66-55",
            password: "superpass"
        })

        await User.delete({ name: "Michael Jackson" })
        const user = await User.find({ name: "Michael Jackson" })

        expect(user).to.be.null 
    })
})