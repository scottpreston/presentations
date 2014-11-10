var phantomcss = require('phantomcss');
phantomcss.init({
    screenshotRoot: './screenshots',
    failedComparisonsRoot: './failures',
    libraryRoot: 'node_modules/phantomcss'
});
var url = 'http://dev.lunchosaurs.com/';
casper.start();
casper.viewport(1024, 768);
casper.thenOpen(url, function () {
    phantomcss.screenshot('.header', 'theheader');
});

casper.then(function () {
    phantomcss.compareAll();
});

casper.run(function () {
    phantom.exit(phantomcss.getExitStatus());
});