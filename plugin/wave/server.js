var express   = require('express');
var fs        = require('fs');

var app       = express.createServer();
var staticDir = express.static;

var opts = {
	port :      1947,
	baseDir :   __dirname + '/../../'
};

app.configure(function() {
	[ 'css', 'js', 'plugin', 'lib' ].forEach(function(dir) {
		app.use('/' + dir, staticDir(opts.baseDir + dir));
	});
});

app.get("/", function(req, res) {
	fs.createReadStream(opts.baseDir + '/index.html').pipe(res);
});

app.listen(opts.port || null);

var brown = '\033[33m', 
	green = '\033[32m', 
	reset = '\033[0m';

var slidesLocation = "http://localhost" + ( opts.port ? ( ':' + opts.port ) : '' );

console.log( brown + "reveal.js - wave to slide" + reset );
console.log( "1. Open the slides at " + green + slidesLocation + reset );
console.log( "2. Accept the webcam request" );
console.log( "3. Advance through your slides through waving your hand in front of your camera" );
