'use strict';

var app = require('./app');
var db = require('./db');
var https = require('https');
var fs = require('fs');
var path = require('path');

var options = {
    cert: fs.readFileSync(path.join(__dirname, 'cert.pem')),
    key: fs.readFileSync(path.join(__dirname, 'key.pem'))
}

var port = 8080;
var server = https.createServer(options, app)
.listen(port, function (err) {
  if (err) throw err;
  console.log('HTTPS server patiently listening on port', port);
  db.sync()
  .then(function () {
    console.log('Oh and btw the postgres server is totally connected, too');
  });
});

module.exports = server;
