var sqs = require('sqs');

var queue = sqs({
    access:'ACCESS',
    secret:'SECRET',
    region:'us-east-1',
    https: true
});

var myip = require('myip');

myip(function (err, ip) {
    if (err) return console.error(err);
    pushQueue(ip);
});

function pushQueue(ipAddress) {
    // push some data to the test queue
    var dataObject = {
        status:'online',
        remoteIp: ipAddress
    };
    queue.push('jr-status', dataObject);
    console.log('pushing data to SQS');
    console.log(dataObject);
}
