require('dotenv').config();

const server = require('./models/server');
const miServer=  new server();


miServer.listen();