var casper = require('casper').create();
casper.start();
var viewports = [
    {name: 'normal', width: 1024, height: 768},
    {name: 'iphone', width: 320, height: 480}
];
casper.each(viewports, function(casper, viewport) {
    casper.then(function() {
        casper.viewport(viewport.width, viewport.height);
    });
    casper.thenOpen('http://casperjs.org/', function () {
        this.capture('casperjs-' + viewport.name + '.png');
    });
});
casper.run();