import * as Mongoose from 'mongoose'
import { config } from './config';
(<any>Mongoose).Promise = Promise;

export class Database {
    private uri: string;
    private ENV: String
    private static instance: Database;

    private constructor (env: String) {
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

    public static getInstance(env: string): Database {
        if (this.instance) return this.instance;
        const instance = new Database(env);
        this.instance = instance;
        return instance;
    }

    async connect() {
        await Mongoose.connect(this.uri);
    }

    async getMongoose () {
        if (Mongoose.connection.readyState === 1) return Mongoose // Connected
        
        await this.connect()
        return Mongoose;
    }
}