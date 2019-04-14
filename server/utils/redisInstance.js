const redis = require('redis');
const bluebird = require("bluebird");
let instance = null;


bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
const REDIS_URL = process.env.REDIS_URL;
var client= redis.createClient(REDIS_URL)
client.on('error', function (err) {
  console.log('could not establish a connection with redis. ' + err);
});
client.on('connect', function (err) {
  console.log('connected to redis successfully');
});


module.exports = { client }
