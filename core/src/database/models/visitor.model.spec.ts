import 'mocha'
import * as Mongoose from 'mongoose'
import { expect } from 'chai'
import { clearDb } from 'mongo-interlude'
import { config } from '../config';

import { Visitor, IVisitorModel } from './visitor.model'
import { Visit } from './visit.model';

describe('Visitor model', () => {
    beforeEach( async () => {
        await Visitor.create({
            fname: "Michael",
            lname: "Jackson",
            patronymic: "Jackson",
            birthdate: new Date("01 01 1978"),
            phoneNumber: "8-900-888-55-66",
            email: "jackson@mail.com",
            password: "123"
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
        const result = await Visitor.startSession({ email: "jackson@mail.com", password: "123" })
        const visitor = await Visitor.find({ email: "jackson@mail.com" })

        expect(visitor.sessionToken).to.deep.equal(result)
    })

    it ('should stop visitor session', async () => {
        const sessionToken = await Visitor.startSession({ email: "jackson@mail.com", password: "123" })
        const stoppedsessionToken = await Visitor.stopSession({ email: "jackson@mail.com" })

        expect(sessionToken).to.deep.equal(stoppedsessionToken)
    })

    it ('should get entry timestamp of undefined', async () => {
        const visitor = await Visitor.find({ email: 'jackson@mail.com' })

        expect(visitor.entryTimestamp).to.be.undefined
    })

    it ('should get time of entry', async () => {
        const visitor = await Visitor.find({ email: 'jackson@mail.com' })
        await Visit.start({ visitorId: visitor._id })
        const uVisitor = await Visitor.find({ email: 'jackson@mail.com' })

        expect(uVisitor.entryTimestamp).to.not.be.undefined 
        expect(uVisitor.exitTimestamp).to.be.undefined 
    })

    it ('should get time of exit', async () => {
        const visitor = await Visitor.find({ email: 'jackson@mail.com' })
        await Visit.start({ visitorId: visitor._id })
        await Visit.stop({ visitorId: visitor._id })
        const uVisitor = await Visitor.find({ email: 'jackson@mail.com' })

        expect(uVisitor.entryTimestamp).to.not.be.undefined 
        expect(uVisitor.exitTimestamp).to.not.be.undefined
    })

    it('should have multiply visits', async () => {
        const visitor = await Visitor.find({ email: 'jackson@mail.com' })
        await Visit.start({ visitorId: visitor._id })
        await Visit.stop({ visitorId: visitor._id })
        await Visit.start({ visitorId: visitor._id })
        await Visit.stop({ visitorId: visitor._id })
        const uVisitor = await Visitor.find({ email: 'jackson@mail.com' })

        expect(uVisitor.visitsHistory.length).to.equal(2)
    })

    it ('should entry a Visitor', async () => {
        const visitor = await Visitor.find({ email: 'jackson@mail.com' })
        const result = await Visitor.entry({ _id: visitor._id })

        expect(result).to.not.be.undefined 
    })

    it ('should exit a Visitor', async () => {
        const visitor = await Visitor.find({ email: 'jackson@mail.com' })
        await Visitor.entry({ _id: visitor._id })
        const result = await Visitor.exit({ _id: visitor._id })

        expect(result).to.not.be.undefined 
    })

    it ('should find populated visitor', async () => {
        const visitor = await Visitor.find({ email: 'jackson@mail.com' })
        await Visitor.entry({ _id: visitor._id })
        const result = await Visitor.findWithPopulation({ _id: visitor._id })

        expect(result.currentVisit).to.be.an('object')
        expect(result.currentVisit.startDate).to.be.an('date');
    })

    
})