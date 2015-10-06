// Load the http module to create an http server.
var http = require('http');
var url = require('url');
var port = 8001;

var usbport = "/dev/ttyUSB1";

var SerialPort = require("serialport").SerialPort;
var sp = new SerialPort(usbport, {
    baudrate: 9600
});

function write(pin, pos) {
    if (pin >= 0 && pos >= 0) {
        var b = [255, pin, pos];
        sp.write(b);
        console.log("serial port writing on pin =" + pin + ", pos = " + pos );
    }
}

// Configure our HTTP server to respond with Hello World to all requests.
var server = http.createServer(function (request, response) {
    var headers = {};
    headers["Access-Control-Allow-Origin"] = "*";
    headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
    headers["Access-Control-Allow-Credentials"] = false;
    headers["Access-Control-Max-Age"] = '86400'; // 24 hours
    headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
    headers["Content-Type"] = "text/plain";
    response.writeHead(200, headers);
    var url_parts = url.parse(request.url, true);
    var pin = url_parts.query.pin;
    var pos = url_parts.query.pos;
    write(pin,pos);
    response.end("pin = " + pin + ", pos = " + pos );
});

// Listen on port 8001, IP defaults to 127.0.0.1
server.listen(port);

console.log("Server running at http://127.0.0.1:" + port);