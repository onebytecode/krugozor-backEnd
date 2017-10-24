import * as _Mongoose from 'mongoose'
import { Mongoose } from 'mongoose';
import { config } from './config';
(<any>_Mongoose).Promise = Promise;

export class Database {
    private mongoose: Mongoose 
    private uri: string;
    private ENV: String

    constructor (env: String) {
        this.mongoose = new Mongoose()
        this.ENV      = env
        this.uri      = this.getUri()
    }

    private getUri(): string {
        switch(this.ENV) {
            case 'test': return config.uri.test
            case 'dev':  return config.uri.dev
            case 'production': return config.uri.production
        }
    }

    private async connect() {
        await this.mongoose.connect(this.uri)
    }

    async getMongoose (): Promise<Mongoose> {
        if (this.mongoose.connection.readyState === 1) return this.mongoose 
        await this.connect()
        return this.mongoose 
    }
}