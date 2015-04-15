var http = require('http');
var server = http.createServer(function (request, response) {
    response.writeHead(200, {"Content-Type": "text/plain"});
    response.end("Hello Everyone\n");
});
console.log('listening on 5001');
server.listen(5001);