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
        this.ENV = env;
        this.uri = this.getUri();
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
    getMongoose() {
        return __awaiter(this, void 0, void 0, function* () {
            if (Mongoose.connection.readyState === 1)
                return Mongoose;
            yield this.connect();
            return Mongoose;
        });
    }
}
exports.Database = Database;
//# sourceMappingURL=database.js.map