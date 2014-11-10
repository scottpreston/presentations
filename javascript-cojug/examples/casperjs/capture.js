var casper = require('casper').create();
casper.start();
casper.viewport(1024, 768);
casper.thenOpen('https://google.com/', function () {
    this.capture('netjets1.png');
});

casper.run();