var NwBuilder = require('node-webkit-builder');
var nw = new NwBuilder({
    files: './quickstart/**', // use the glob format
    platforms: ['win','osx']
});

// Log stuff you want
nw.on('log',  console.log);

// Build returns a promise
nw.build().then(function () {
   console.log('all done!');
}).catch(function (error) {
    console.error(error);
});

// And supports callbacks
nw.build(function(err) {
    if(err) console.log(err);
})