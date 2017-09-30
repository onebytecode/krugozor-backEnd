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
    }
    assignMorgan() {
        this.app.use(morgan('dev'));
    }
    assignDefaultRoutes() {
        this.app.use(this.routes);
    }
    run() {
        this.app.listen(this.port, () => {
            console.log(color.cyan(`App listen on ::${this.port}::`));
        });
    }
}
exports.Server = Server;
//# sourceMappingURL=server.js.map