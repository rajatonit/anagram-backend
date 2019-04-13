import express from 'express';
const logger = require('./utils/logger');
const routes = express();


routes.post("/stuff", function (req, res) {
    var response = {
        fullname: `${req.body.firstname} ${req.body.lastname}`
    }
    logger.logResponse(req.id, response, 200);
    res.status(200).send(response);
});


export default routes;