import * as chai from 'chai';
import * as chaiHttp from '../../../../../node_modules/chai-http';
chai.use(chaiHttp)
import * as mongoInterlude from 'mongo-interlude'

import { assert, expect } from 'chai';
import { Server } from '../../../server';
import { Visitor } from '../../../../database/models/visitor.model'
import { Database } from '../../../../database/database';


describe('Api v1 tests', () => {

    before(async () => {
        this.server = new Server(8080);
        await this.server.run()
        this.server.assignDefaultRoutes()
        this.db = new Database('test')
        this.mongoose = await this.db.getMongoose()
    })

    afterEach(async () => {
        await mongoInterlude.clearDb({
            mongoose: this.mongoose,
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
                        fname
                        lname
                        email
                        phoneNumber
                    }
                }`
            }).end((err, { body: { data: { registerNewVisitor: visitor } } }) => {
                if (err) done(err)

                expect(visitor.fname).to.be.equal('Boris')
                expect(visitor.lname).to.be.equal('Grozny')
                expect(visitor.email).to.be.equal('boris@mail.com')
                expect(visitor.phoneNumber).to.be.equal('123123123')
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