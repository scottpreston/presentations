var rules = null;
var request = require('request');
var moment = require('moment');
var amqp = require('amqp');
var handledEvents = {};

handledEvents.notify = function (message) {
    request.post('http://192.168.1.60/notify/email', {form: {msg: message}}, function (error, response, body) {
        if (!error) {
            console.log('notification message = ' + message);
        }
    });
};

handledEvents.broadcast = function (endpoint) {
    if (endpoint) {
        request(endpoint, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(moment().format("MM-DD-YYYY HH:mm:ss.SSS") + ' called endpoint ' + endpoint + " finished");
            }
        });
    }
};

function processEvent(eName, eData) {
    var eventName = eName || "", eventData = eData || {};
    // in case event is fired directly
    if (handledEvents[eventName]) {
        handledEvents[eventName](eventData);
    } else {
        rules.forEach(function (rule) {
            if (rule.name === eventName) {
                console.log('running event: ' + rule.name);
                if (handledEvents[rule.type]) {
                    handledEvents[rule.type](rule.data);
                } else {
                    console.error('event (' + rule.name + ') not defined');
                }

            }
        });
    }
}
function createConnection() {
    var connection = amqp.createConnection({host: 'localhost'});
    connection.on('ready', function () {
        connection.exchange('house', {
            type: 'fanout',
            autoDelete: false
        }, function (exchange) {
            connection.queue('tmp-' + Math.random(), {exclusive: true},
                    function (queue) {
                        queue.bind('house', '');
                        console.log(' [*] Waiting for house events. To exit press CTRL+C')
                        queue.subscribe(function (msg) {
                            var message = msg.data.toString('utf-8');
                            console.log("message received = " + message);
                            var eventDetail = JSON.parse(message);
                            processEvent(eventDetail.name, eventDetail.data);
                        });
                    })
        });
    });
}

// kicks off everything by requesting event rules
request('http://192.168.1.60/event/getAll', function (error, response, body) {
    if (!error && response.statusCode == 200) {
        rules = JSON.parse(body);
        createConnection();
//  	processEvent("test");
  }
});

// testing
//processEvent("test");
//processEvent("notify", {message: "hi scott testing directly...."});

