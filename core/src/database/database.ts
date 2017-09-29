import * as Mongoose from 'mongoose'

export class Database {
    private mongoose: Mongoose 
    private uri: String
    private ENV: String

    constructor (env: String, root: String) {
        this.mongoose = Mongoose
        this.uri      = this.getUri()
        this.ENV      = env
    }

    private getUri(): String {
        switch(this.ENV) {
            case 'test': return "mongodb://localhost/anticafe_test";
            case 'dev': return "mongodb://localhost/anticafe_dev";
        }
    }

    private async connect() {
        await this.mongoose.connect(this.uri)
    }

    async getMongoose (): Mongoose {
        if (this.mongoose.connections[0].host !== undefined) return this.mongoose 
        await this.connect()
        return this.mongoose 
    }
}