import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes';
import morgan from 'morgan'
import helmet from 'helmet'
import mongoose from 'mongoose'
const addRequestId = require('express-request-id')();
var loggerFormat = ':id [:date[web]]" :method :url" :status';
const logger = require('./utils/logger');
const app = express();
app.use(helmet())
app.disable('x-powered-by')

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, 
    bufferCommands: false, // Disable mongoose buffering
    bufferMaxEntries: 0 // and MongoDB driver buffering
},
    ).then(  
    () => {console.log("connected to mongo")},
    (err) => { console.log(err)})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(addRequestId)


morgan.token('id', function getId(req) {
return req.id
});

app.use(morgan(loggerFormat, {
skip: function (req, res) {
    return res.statusCode < 400
},
stream: process.stderr
}));
app.use(morgan(loggerFormat, {
skip: function (req, res) {
    return res.statusCode >= 400
},
stream: process.stdout
}));


app.use(function (req, res, next){
var log = logger.loggerInstance.child({
    id: req.id,
    body: req.body
}, true)
log.info({req: req})
next();
});

app.use(function (req, res, next) {
function afterResponse() {
    res.removeListener('finish', afterResponse);
    res.removeListener('close', afterResponse);
    var log = logger.loggerInstance.child({
        id: req.id
    }, true)
    log.info({res:res}, 'response')
}
res.on('finish', afterResponse);
res.on('close', afterResponse);
next();
});

app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
next();
});


app.get("/health", function (req, res) {
res.status(200).send(
    "ok"
);
});

app.use('/api/v1/', routes);



export default app;