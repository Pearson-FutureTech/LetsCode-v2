'use strict';

var http = require('http'),
    mongoose = require('mongoose');

var config = require('./config'),
    app = require('./app');

mongoose.connect(config.get('MONGOLAB_URI') || config.get('db:mongodbURI'));

var db = mongoose.connection;
db.on('error', function(e) {
    console.log('Failed to connect', e);
    throw e;
});
db.once('open', function () {});

var server = http.createServer(app);

server.listen(app.get('port'), function () {
    console.log('Let\'s Code server started on port ' + app.get('port'));
});
