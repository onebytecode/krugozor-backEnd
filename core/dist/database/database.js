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
class Database {
    constructor(env, root) {
        this.mongoose = Mongoose;
        this.uri = this.getUri();
        this.ENV = env;
    }
    getUri() {
        switch (this.ENV) {
            case 'test': return "mongodb://localhost/anticafe_test";
            case 'dev': return "mongodb://localhost/anticafe_dev";
        }
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mongoose.connect(this.uri);
        });
    }
    getMongoose() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.mongoose.connections[0].host !== undefined)
                return this.mongoose;
            yield this.connect();
            return this.mongoose;
        });
    }
}
exports.Database = Database;
//# sourceMappingURL=database.js.map