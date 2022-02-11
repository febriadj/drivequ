const server = require('./server');

const port = process.env.PORT || 5050;

server.listen(port);
console.log(`[${port}] server running...`);
