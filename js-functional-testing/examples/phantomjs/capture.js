var page = require('webpage').create();
page.open('http://github.com/', function() {
  page.render('github1.png');
  phantom.exit();
});