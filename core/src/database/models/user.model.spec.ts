import 'mocha'
import * as Mongoose from 'mongoose'
import { expect } from 'chai'
import { clearDb } from 'mongo-interlude'

const dbUri: string = require('../config').uri.test 

import { User, IUserModel } from './user.model'

describe('User model', () => {
    beforeEach( async () => {
        if (!Mongoose.connections[0].host) await Mongoose.connect(dbUri)
        await User.create({
            fname: "Michael",
            lname: "Jackson",
            patronymic: "Jackson",
            birthdate: new Date("01 01 1978"),
            phoneNumber: "8-900-888-55-66",
            email: "jackson@mail.com"
        })
    })

    afterEach(async () => {
        await clearDb({ mongoose: Mongoose, silent: true })
    })

    it ('should find user', async () => {
        const user = await User.find({ email: "jackson@mail.com" })

        expect(user.fname).to.be.equal('Michael')
        expect(user.lname).to.be.equal('Jackson')
        expect(user.phoneNumber).to.be.equal('8-900-888-55-66')
    })

    it ('should create session', async () => {
        const result = await User.startSession({ email: "jackson@mail.com" })
        const user   = await User.find({ email: "jackson@mail.com" })

        expect(user.sessionId).to.be.equal(result)
    })

    it ('should stop user session', async () => {
        const sessionId = await User.startSession({ email: "jackson@mail.com" })
        const stoppedSessionId = await User.stopSession({ email: "jackson@mail.com" })

        expect(sessionId).to.be.equal(stoppedSessionId.toString())
    })

    
})