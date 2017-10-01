"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const api_1 = require("./api/v1/api");
function Routes() {
    const router = express_1.Router();
    router.route('/')
        .get(function (req, res) {
        res.send('Hello, world! ...and now in focken typescript!');
    });
    router.use('/gql', api_1.Api());
    return router;
}
exports.Routes = Routes;
//# sourceMappingURL=routes.js.map