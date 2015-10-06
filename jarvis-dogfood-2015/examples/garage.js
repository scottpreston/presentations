// Load the http module to create an http server.
var http = require('http');
var httpClient = require('http');
var url = require('url');
var port = 8000;

var usbport = "/dev/ttyACM0";
var serialport = require("serialport");
var SerialPort = serialport.SerialPort;
var sp = new SerialPort(usbport, {
    baudrate: 9600,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false,
    parser: serialport.parsers.readline("\n")
});

var sensorData = [];
var sData = "";
var doorState = 1; // closed = 1, open = 0

sp.on("data", function (data) {
    data = data.toString();
    var out = data.split('~');
    if (out.length == 5) {
        sensorData = out;
    }
});

var doorOpenOptions = {
    host: 'jarvis2.prestonresearch.net',
    path: '/event/publish/auto-garage-open'
};
var doorClosedOptions = {
    host: 'jarvis2.prestonresearch.net',
    path: '/event/publish/auto-garage-closed'
};

// check every second for change in state.
var doorChecker = setInterval(function () {
    if (sensorData[3] != doorState) {
        if (sensorData[3] == 0) { // open
            console.log("door open...");
            httpClient.get(doorOpenOptions, function (res) {
                console.log("Got response for door open: " + res.statusCode);
            });
            doorState = 0;
        } else { // door closed
            console.log("door closed...");
            httpClient.get(doorClosedOptions, function (res) {
                console.log("Got response for door closed : " + res.statusCode);
            });
            doorState = 1;
        }
    }
}, 1000);

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
    var out = {temperature: sensorData[0], humidity: sensorData[1], switch1: sensorData[2], switch2: sensorData[3]};
    response.end(JSON.stringify(out));
});

// Listen on port 8001, IP defaults to 127.0.0.1
server.listen(port);

console.log("Server running at http://127.0.0.1:" + port);