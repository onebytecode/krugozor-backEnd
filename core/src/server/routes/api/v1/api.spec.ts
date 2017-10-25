import 'mocha';

// GQL models tests
import * as Mongoose from 'mongoose';
import { config } from '../../../../database/config';
import { Server } from '../../../server';

(<any>Mongoose).Promise = Promise;
(async () => {
    if (Mongoose.connection.readyState === 0) await Mongoose.connect(config.uri.test);
    const server = new Server(8080);
    server.assignDefaultRoutes()
    await server.run()
})()

import './gql-models/visitor.gql-model.spec';
import './gql-models/room.gql-model.spec';
