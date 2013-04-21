/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    tasks = require('./tasks'),
    http = require('http');

// Get yo' models
// var User = require("./models/user.js"),

var app = express();
var server = http.createServer(app);

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon(__dirname + '/public/favicon.ico'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

var port;
app.configure('development', function() {
  port = process.env.PORT || 3000;
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function() {
  port = 80;
  app.use(express.errorHandler());
});

server.listen(port, function() {
});


app.get('/', routes.home);
app.get('/data', routes.data);
app.get('/historical', routes.historical);

/*
 * Run background tasks here:
 */

// Run immediately
// tasks.myTask();

// Run periodically
// setInterval(tasks.myTask, 1000 * 60 * 10);
