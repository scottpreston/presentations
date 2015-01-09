// Load the http module to create an http server.
var http = require('http');
var url = require('url');
var port = 8000;

var usbport = "/dev/ttyUSB0";

var SerialPort = require("serialport").SerialPort;
var sp = new SerialPort(usbport, {
    baudrate: 9600
});

function write(house, device, onoff) {
    if (house >= 0 && device >= 0 && onoff >= 0) {
        var b = [100, house, device, onoff];
        sp.write(b);
        console.log("serial port writing on house =" + house + ", device = " + device + ", onoff=" + onoff);
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
    var house = url_parts.query.house;
    var device = url_parts.query.device;
    var onoff = url_parts.query.onoff;
    write(house,device,onoff);
    response.end("House = " + house + ", Device = " + device + ", Onoff = " + onoff);
});

// Listen on port 8000, IP defaults to 127.0.0.1
server.listen(port);

console.log("Server running at http://127.0.0.1:" + port);