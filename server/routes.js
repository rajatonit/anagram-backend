import express from 'express';
import basicController from './controllers/basicController';
import anagramController from './controllers/anagramController';
import { Mongoose } from 'mongoose';


const logger = require('./utils/logger');
const routes = express();


routes.post ("/", basicController.get);

routes.get("/anagram/:key",anagramController.get)


export default routes;