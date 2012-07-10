var express   = require('express');
var fs        = require('fs');
var io        = require('socket.io');
var _         = require('underscore');
var Mustache  = require('mustache');

var app       = express.createServer();
var staticDir = express.static;

io            = io.listen(app);

var opts = {
	port :      1947,
	baseDir :   __dirname + '/../../'
};

io.sockets.on('connection', function(socket) {
	socket.on('slidechanged', function(slideData) {
		socket.broadcast.emit('slidedata', slideData);
	});
});

app.configure(function() {
	[ 'css', 'js', 'plugin', 'lib' ].forEach(function(dir) {
		app.use('/' + dir, staticDir(opts.baseDir + dir));
	});
});

app.get("/", function(req, res) {
	fs.createReadStream(opts.baseDir + '/index.html').pipe(res);
});

app.get("/notes/:socketId", function(req, res) {

	fs.readFile(opts.baseDir + 'plugin/slidenotes/notes.html', function(err, data) {
		res.send(Mustache.to_html(data.toString(), {
			socketId : req.params.socketId
		}));
	});
	// fs.createReadStream(opts.baseDir + 'slidenotes/notes.html').pipe(res);
});

// Actually listen
app.listen(opts.port || null);

console.log("Open the slides at http://localhost" + (opts.port ? (':' + opts.port) : '') + " and look for a link to the speaker notes in the console");
console.log("Advance through your slides and your notes will advance automatically");
