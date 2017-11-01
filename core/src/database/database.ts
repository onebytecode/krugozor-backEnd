import * as Mongoose from 'mongoose'
import { config } from './config';
(<any>Mongoose).Promise = Promise;

export class Database {
    private uri: string;
    private ENV: String
    private static instance: Database;
    private sleep = (ms) => {
        return new Promise((resolve) => {
            setTimeout(resolve, ms);
        })
    }

    private constructor (env: String) {
        this.ENV      = env
        this.uri      = this.getUri()
        Mongoose.connection.once('open', function() {
            console.log('mongoose open');
        });
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

    private async awaitMongooseConnection() {
        if (Mongoose.connection.readyState === 1) {
            return Mongoose
        } else {
            await this.sleep(50);
            return this.awaitMongooseConnection();
        }
    }

    async getMongoose () {
        if (Mongoose.connection.readyState === 1) return Mongoose; // Connected
        if (Mongoose.connection.readyState === 2) {
            const _m = await this.awaitMongooseConnection();
            return _m;
        }
        await this.connect();
        return Mongoose;
    }
}