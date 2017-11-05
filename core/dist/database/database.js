"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Mongoose = require("mongoose");
const config_1 = require("./config");
Mongoose.Promise = Promise;
class Database {
    constructor(env) {
        this.sleep = (ms) => {
            return new Promise((resolve) => {
                setTimeout(resolve, ms);
            });
        };
        this.ENV = env;
        this.uri = this.getUri();
        Mongoose.connection.once('open', function () {
            console.log('mongoose open');
        });
    }
    getUri() {
        switch (this.ENV) {
            case 'test': return config_1.config.uri.test;
            case 'dev': return config_1.config.uri.dev;
            case 'production': return config_1.config.uri.production;
        }
    }
    static getInstance(env) {
        if (this.instance)
            return this.instance;
        const instance = new Database(env);
        this.instance = instance;
        return instance;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield Mongoose.connect(this.uri);
        });
    }
    awaitMongooseConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            if (Mongoose.connection.readyState === 1) {
                return Mongoose;
            }
            else {
                yield this.sleep(50);
                return this.awaitMongooseConnection();
            }
        });
    }
    getMongoose() {
        return __awaiter(this, void 0, void 0, function* () {
            if (Mongoose.connection.readyState === 1)
                return Mongoose;
            if (Mongoose.connection.readyState === 2) {
                const _m = yield this.awaitMongooseConnection();
                return _m;
            }
            yield this.connect();
            return Mongoose;
        });
    }
}
exports.Database = Database;
//# sourceMappingURL=database.js.map