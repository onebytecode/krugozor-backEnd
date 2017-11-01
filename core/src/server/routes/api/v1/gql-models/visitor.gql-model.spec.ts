import * as chai from 'chai';
import * as chaiHttp from '../../../../../../node_modules/chai-http';
chai.use(chaiHttp)
import * as mongoInterlude from 'mongo-interlude'

import { assert, expect } from 'chai';
import { Visitor } from '../../../../../database/models/visitor.model'
import { Database } from '../../../../../database/database';
import * as Mongoose from 'mongoose';
import { GraphQLError } from 'graphql';

describe('Visitor gql model', () => {
    const sleep = (ms: number) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

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
                        phoneNumber: "123123123",
                        password: "123123"
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
        await Visitor.create({ fname: 'Boris', email: 'boris@email.com', phoneNumber: '123', password: "123" })
        const sessId = await Visitor.startSession({ email: 'boris@email.com', password: "123" })
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
        await Visitor.create({ fname: 'Boris', email: 'boris@email.com', phoneNumber: '123123123123', password: "123123123" })
        const sessId = await Visitor.startSession({ email: 'boris@email.com', password: "123123123" })
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

    it ('password required via register', async () => {
        try {
            const queryString = `
            mutation {
                registerNewVisitor(fname: "Boris", email: "test@mail.com", phoneNumber: "123") {
                    sessionToken
                }
            }`
            await chai.request('localhost:8080')
                .post('/gql')
                .send({ query: queryString });
        } catch (e) {
            expect(e).to.be.not.null;
            const { response: { res: { text } } } = e;
            const jText = JSON.parse(text);
            expect(jText.errors).to.be.an('array');
            const { message } = jText.errors[0];
            expect(message).to.equal('Field "registerNewVisitor" argument "password" of type "String!" is required but not provided.');
        }
    })

    it ('should have current visit field', async () => {
        try {
            const visitor = await Visitor.create({ fname: "visitor", email: "123", password: "123", phoneNumber: "123" })
            await Visitor.startSession({ email: visitor.email, password: visitor.password  })
            await Visitor.entry({ _id: visitor._id });
            const query = `
            {
                getVisitor(email: "123") {
                    currentVisit {
                        startDate
                    }
                }   
            }`
            const {
                body: {
                    data: {
                        getVisitor: {
                            currentVisit
                        }
                    }
                }
            } = await chai.request('localhost:8080')
                    .get('/gql')
                    .send({ query })
            
            expect(currentVisit).to.be.an('object');
            expect(currentVisit.startDate).to.be.a('string');
        } catch (e) {
            throw new Error(e);
        }
    })

    it ('should have visits history', async () => {
        try {
            const visitor = await Visitor.create({ fname: "visitor", email: "123", password: "123", phoneNumber: "123" })
            await Visitor.startSession({ email: visitor.email, password: visitor.password  })
            await Visitor.entry({ _id: visitor._id });
            await Visitor.exit({ _id: visitor._id });
            const query = `
            {
                getVisitor(email: "123") {
                    currentVisit {
                        startDate
                    }
                    visitsHistory {
                        startDate
                        endDate
                    }
                }   
            }`
            const {
                body: {
                    data: {
                        getVisitor: {
                            currentVisit,
                            visitsHistory
                        }
                    }
                }
            } = await chai.request('localhost:8080')
                    .get('/gql')
                    .send({ query })
            
            expect(currentVisit).to.be.null;
            expect(visitsHistory).to.be.an('array').with.lengthOf(1);
            expect(visitsHistory[0].startDate).to.be.a('string');
            expect(visitsHistory[0].endDate).to.be.a('string');
            const startDate = new Date(visitsHistory[0].startDate);
            const endDate = new Date(visitsHistory[0].endDate);
        } catch (e) {
            throw new Error(e);
        }
    })
})