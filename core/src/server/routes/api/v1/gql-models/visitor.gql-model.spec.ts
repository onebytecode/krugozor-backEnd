import * as chai from 'chai';
import * as chaiHttp from '../../../../../../node_modules/chai-http';
chai.use(chaiHttp)
import * as mongoInterlude from 'mongo-interlude'

import { assert, expect } from 'chai';
import { Visitor } from '../../../../../database/models/visitor.model'
import { Database } from '../../../../../database/database';
import * as Mongoose from 'mongoose';

describe('Visitor gql model', () => {

    afterEach(async () => {
        await mongoInterlude.clearDb({
            mongoose: Mongoose,
            silent: true 
        })
    })

    it ('should register new visitor', (done) => {
        chai.request('localhost:8080')
            .post('/gql')
            .send({
                query: `
                mutation {
                    registerNewVisitor(
                        fname: "Boris",
                        lname: "Grozny",
                        email: "boris@mail.com",
                        phoneNumber: "123123123"
                    ) {
                        sessionToken
                    }
                }`
            }).end((err, { body: { data: { registerNewVisitor: sessionToken } } }) => {
                if (err) done(err)

                expect(sessionToken).to.be.not.null;
                expect(sessionToken).to.be.not.undefined;
                done()
            })
    })

    it ('should get visitor', (done) => {
        (async () => {
            await Visitor.create({ fname: 'Boris', email: 'boris@email.com', phoneNumber: '123123123123' })
        })()
        chai.request('localhost:8080')
            .get('/gql')
            .send({
                query: `{
                    getVisitor(email: "boris@email.com") {
                        fname
                        email
                        phoneNumber
                    }
                }`
            }).end((err, { body: { data: { getVisitor: visitor } } }) => {
                if (err) done(err)
                expect(visitor.fname).to.be.equal('Boris')
                expect(visitor.email).to.be.equal('boris@email.com')
                expect(visitor.phoneNumber).to.be.equal('123123123123')
                done()
            })
    })

    it ('should entry visitor', async function() {
        await Visitor.create({ fname: 'Boris', email: 'boris@email.com', phoneNumber: '123123123123' })
        const sessId = await Visitor.startSession({ email: 'boris@email.com'})
        try {
            const queryString = `
            mutation {
               visitorTerminalTrigger(sessionToken: "${sessId}") {
                   isExit
                   isEntered
               } 
            }`
            const result = await chai.request('localhost:8080')
                .post('/gql')
                .send({ query: queryString })
            const { body: { data: { visitorTerminalTrigger: res } }} = result

            expect(res.isEntered).to.equal(true)
            expect(res.isExit).to.equal(false)
        } catch (e) {
            throw new Error(e)
        }
    })

    it ('should exit visitor', async function() {
        await Visitor.create({ fname: 'Boris', email: 'boris@email.com', phoneNumber: '123123123123' })
        const sessId = await Visitor.startSession({ email: 'boris@email.com'})
        await Visitor.entry({ sessionToken: sessId })
        try {
            const queryString = `
            mutation {
               visitorTerminalTrigger(sessionToken: "${sessId}") {
                   isExit
                   isEntered
               } 
            }`
            const result = await chai.request('localhost:8080')
                .post('/gql')
                .send({ query: queryString })
            const { body: { data: { visitorTerminalTrigger: res } }} = result

            expect(res.isEntered).to.equal(false)
            expect(res.isExit).to.equal(true)
        } catch (e) {
            throw new Error(e)
        }
    })
})