var sqs = require('sqs');
var request = require('request');
var moment = require('moment');

var queue = sqs({
    access: 'ACCESS',
    secret: 'SECRET',
    region: 'us-east-1',
    https: true
});
console.log('starting jarvis-robot-status...');
// pull messages from the test queue
queue.pull('jr-status', function (message, callback) {
    console.log('someone pushed jr-status', message);
    updateStatus('jr', message.status, message.remoteIp);
    callback(); // we are done with this message - pull a new one
    // calling the callback will also delete the message from the queue
});

// pull messages from the test queue
queue.pull('feynman-status', function (message, callback) {
    console.log('someone pushed feynman-status', message);
    updateStatus('feynman', message.status, message.remoteIp);
    callback(); // we are done with this message - pull a new one
    // calling the callback will also delete the message from the queue
});

function updateStatus(robot, status, ip) {
    var url = 'http://192.168.1.60/status/setJr/' + status + '/' + ip;
    if (robot == 'feynman') {
        url = 'http://192.168.1.60/status/setFeynman/' + status + '/' + ip;
    }
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(moment().format("MM-DD-YYYY HH:mm:ss.SSS") + ' called endpoint ' + url + " finished");
        }
    });
}
