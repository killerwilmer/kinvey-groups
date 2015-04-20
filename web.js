var express = require('express');
var http = require('http');
var livereload = require('livereload');
var logfmt = require('logfmt');
var request = require('request');
var bodyParser = require('body-parser');

var pkg = require('./package.json');

var PROJECT_ROOT = __dirname;
var SERVER_ROOT = PROJECT_ROOT;

////

var app = express();
var PORT = process.env.PORT || 8080;

// Livereload
var lrOptions = {
    exts: [
        'html',
        'css',
        'js',
        'png',
        'gif',
        'jpg',
        'jpeg',
    ],
    exclusions: [
        '.git/',
        '.idea/',
        'app/bower/',
        'node_modules/',
    ],
    applyJSLive: false,
    applyCSSLive: true,
};


/////////////////////////////////////////////////////////////
// SERVER

http.createServer(app).listen(PORT, function() {
    // live reload
    livereload.createServer(lrOptions).watch(SERVER_ROOT);
    console.log('Server listening at http://localhost:' + PORT);
});


/////////////////////////////////////////////////////////////
// Routing


//
// Logger
app.use(logfmt.requestLogger());


//
// Parse Req Body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


//
// Serve Static
app.use('/', express.static(SERVER_ROOT));


//
// Angular html5mode
app.all('/*', function(req, res) {
    res.sendFile(SERVER_ROOT + '/index.html');
});
