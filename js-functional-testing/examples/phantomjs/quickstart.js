var page = require('webpage').create();
page.open('http://www.phantomjs.org/', function (status) {
    console.log('Loading a web page');
    phantom.exit();
});