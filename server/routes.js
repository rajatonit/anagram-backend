import express from 'express';
import basicController from './controllers/basicController';
import anagramController from './controllers/anagramController';
import { Mongoose } from 'mongoose';


const logger = require('./utils/logger');
const routes = express();


routes.post ("/", basicController.get);

routes.post("/stuff", function (req, res) {
    var response = {
        fullname: `${req.body.firstname} ${req.body.lastname}`
    }
    logger.logResponse(req.id, response, 200);
    res.send(200).send(response);
});

routes.get("/anagram/:key",anagramController.get)


export default routes;