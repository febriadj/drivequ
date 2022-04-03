const server = require('./server');
const config = require('./config');

const port = process.env.PORT || config.port;

server.listen(port);
console.log(`[${port}] server running...`);
