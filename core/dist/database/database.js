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
const config = require('./config.json');
Mongoose.Promise = Promise;
class Database {
    constructor(env) {
        this.mongoose = Mongoose;
        this.ENV = env;
        this.uri = this.getUri();
    }
    getUri() {
        switch (this.ENV) {
            case 'test': return config.uri.test;
            case 'dev': return config.uri.dev;
            case 'production': return config.uri.production;
        }
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mongoose.connect(this.uri);
        });
    }
    getMongoose() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.mongoose.connections[0].host)
                return this.mongoose;
            yield this.connect();
            return this.mongoose;
        });
    }
}
exports.Database = Database;
//# sourceMappingURL=database.js.map