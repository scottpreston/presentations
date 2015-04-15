var mysql = require('mysql');
var connection = mysql.createConnection({
    host: '192.168.188.10',
    user: 'root',
    password: 'password',
    database: 'test'
});

connection.connect(function(err) {
    console.log('connected as id ' + connection.threadId);
});

// read all
connection.query('SELECT * from contact', function (err, rows, fields) {
    console.log(rows);
});

connection.end();