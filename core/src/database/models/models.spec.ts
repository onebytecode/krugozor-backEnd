import 'mocha';
import * as Mongoose from 'mongoose';
(<any>Mongoose).Promise = Promise;
import { config } from '../config';

(async () => {
    if (Mongoose.connection.readyState === 0) await Mongoose.connect(config.uri.test);
})()
// Models tests
import './room.model.spec';
import './visit.model.spec';
import './visitor.model.spec';