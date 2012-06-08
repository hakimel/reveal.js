var express   = require('express');
var fs        = require('fs');
var io        = require('socket.io');
var _         = require('underscore');

var app       = express.createServer();
var staticDir = express.static;

io            = io.listen(app);

var opts = {
  port :      1947,
  baseDir :   __dirname + '/../'
};

io.sockets.on('connection', function(socket) {
  socket.on('slidechanged', function(slideData) {
    socket.broadcast.emit('slidedata', slideData);
  });
});

app.configure(function() {
  [ 'css', 'assets', 'js', 'lib' ].forEach(function(dir) {
    app.use('/' + dir, staticDir(opts.baseDir + dir));
  });
});

app.get("/", function(req, res) {
  fs.createReadStream(opts.baseDir + '/index.html').pipe(res);
});

app.get("/_notes", function(req, res) {
  fs.createReadStream(opts.baseDir + 'slidenotes/notes.html').pipe(res);
});

// Actually listen
app.listen(opts.port || null);

console.log("Your slides are at http://localhost" + (opts.port ? (':' + opts.port) : ''));
console.log("Your notes are at http://localhost" + (opts.port ? (':' + opts.port) : '') + '/_notes');
console.log("Advance through your slides and your speaker notes will advance automatically");