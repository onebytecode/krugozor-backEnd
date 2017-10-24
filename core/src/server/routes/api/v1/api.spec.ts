import 'mocha';

// GQL models tests
import * as Mongoose from 'mongoose';
(<any>Mongoose).Promise = Promise;

import './gql-models/visitor.gql-model.spec';