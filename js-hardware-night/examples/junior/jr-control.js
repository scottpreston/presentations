var sqs = require('sqs');
var request = require('request');
var moment = require('moment');

var queue = sqs({
    access: 'ACCESS_KEY',
    secret: 'SECRET',
    region: 'us-east-1',
    https: true
});
console.log('listening for sqs...');
// pull messages from the test queue
queue.pull('jr-queue', function (message, callback) {
    console.log('someone pushed', message);
    if (message.left) {
        moveRobot(message.left, message.right, message.duration);
    }
    if (message.pin) {
        moveHead(message.pin,message.pos);
    }
    callback(); // we are done with this message - pull a new one
    // calling the callback will also delete the message from the queue
});

function moveRobot(left, right, duration) {
    var url = 'http://jr.prestonresearch.net:8080/nav/' + left + '/' + right + '/' + duration;
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(moment().format("MM-DD-YYYY HH:mm:ss.SSS") + ' called endpoint ' + url + " finished");
        } else {
            console.error(error);
        }
    });
}
function moveHead(pin,pos) {
    var url = 'http://jr.prestonresearch.net:8080/move/' + pin + '/' + pos + '/1';
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(moment().format("MM-DD-YYYY HH:mm:ss.SSS") + ' called endpoint ' + url + " finished");
        } else {
            console.error(error);
        }
    });
}

