import 'mocha'
import * as Mongoose from 'mongoose'
import { expect } from 'chai'
import { clearDb } from 'mongo-interlude'

const dbUri: string = require('../config').uri.test 

import { Visitor, IVisitorModel } from './visitor.model'

describe('Visitor model', () => {
    beforeEach( async () => {
        if (!Mongoose.connections[0].host) await Mongoose.connect(dbUri)
        await Visitor.create({
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

    it ('should find visitor', async () => {
        const visitor = await Visitor.find({ email: "jackson@mail.com" })

        expect(visitor.fname).to.be.equal('Michael')
        expect(visitor.lname).to.be.equal('Jackson')
        expect(visitor.phoneNumber).to.be.equal('8-900-888-55-66')
    })

    it ('should update visitor', async () => {
        await Visitor.update({ email: 'jackson@mail.com' }, { fname: 'Mike' })

        const visitor = await Visitor.find({ email: 'jackson@mail.com' })

        expect(visitor.fname).to.equal('Mike')
    })

    it ('should create session', async () => {
        const result = await Visitor.startSession({ email: "jackson@mail.com" })
        const visitor   = await Visitor.find({ email: "jackson@mail.com" })

        expect(visitor.sessionId).to.deep.equal(result)
    })

    it ('should stop visitor session', async () => {
        const sessionId = await Visitor.startSession({ email: "jackson@mail.com" })
        const stoppedSessionId = await Visitor.stopSession({ email: "jackson@mail.com" })

        expect(sessionId).to.deep.equal(stoppedSessionId)
    })

    
})