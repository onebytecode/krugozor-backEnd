"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const color = require("colors");
const morgan = require("morgan");
const routes_1 = require("./routes/routes");
class Server {
    constructor(port) {
        this.app = express();
        this.port = port;
        this.routes = routes_1.Routes();
        this.env = process.env.NODE_ENV || 'dev';
    }
    assignMorgan() {
        this.app.use(morgan('dev'));
    }
    assignDefaultRoutes() {
        this.app.use(this.routes);
    }
    run() {
        return new Promise((resolve, reject) => {
            this.app.listen(this.port, () => {
                resolve(true);
                if (this.env !== 'test')
                    console.log(color.cyan(`App listen on ::${this.port}::`));
            });
        });
    }
}
exports.Server = Server;
//# sourceMappingURL=server.js.map