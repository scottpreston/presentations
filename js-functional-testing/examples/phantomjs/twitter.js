var page = require('webpage').create();
page.open(encodeURI("https://mobile.twitter.com/icctalk"), function (status) {
    // Check for page load success
    var followers = page.evaluate(function () {
        return document.querySelector('div.statnum').innerText;
    });
    console.log('you have ' + followers + ' followers..');
    phantom.exit();
});
