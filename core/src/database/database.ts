import * as Mongoose from 'mongoose'
const config = require('./config.json')
Mongoose.Promise = Promise 

export class Database {
    private mongoose: Mongoose 
    private uri: String
    private ENV: String

    constructor (env: String) {
        this.mongoose = Mongoose
        this.ENV      = env
        this.uri      = this.getUri()
    }

    private getUri(): String {
        console.log(this.ENV)
        switch(this.ENV) {
            case 'test': return config.uri.test
            case 'dev':  return config.uri.dev
            case 'production': return config.uri.production
        }
    }

    private async connect() {
        await this.mongoose.connect(this.uri)
    }

    async getMongoose (): Mongoose {
        if (this.mongoose.connections[0].host) return this.mongoose 
        await this.connect()
        return this.mongoose 
    }
}