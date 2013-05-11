var express   = require('express');
var fs        = require('fs');
var io        = require('socket.io');
var _         = require('underscore');
var Mustache  = require('mustache');

var app       = express.createServer();
var staticDir = express.static;

io            = io.listen(app);

var opts = {
  port :      1984,
  baseDir :   __dirname + '/../../'
};

var masters = {};
var clients = {};
var chartData = {'chart':'none'};
var isMasterReady = false;

var cacheItem = function(item, cache, callback) {
  if (!(item.id in cache)){
    cache[item.id] = item;
  }

  if (callback) callback();
}

// we need some verification for master. maybe...
io.of('/master').on('connection', function(master) {
  console.log('master connected - ' + master.id);

  cacheItem(master, masters, function() {
    console.log('master cached & ready to emit ');
  });

  master.on('disconnect', function() {
    delete masters[master.id];
    isMasterReady = false;
    chartData = {'chart':'none'};
    console.log('master disconnected');
    for (var id in clients)
      clients[id].emit('master_lost', {});
  });

  master.on('force_disconnect', function() {
    master.disconnect();
  });

  master.on('master_ready', function(masterData) {
    console.log('master ready event ' + masterData);
    chartData = masterData;
    isMasterReady = true;
    for (var id in clients)
      clients[id].emit('master_ready', chartData);
  })
});

io.of('/client').on('connection', function(client) {
  console.log('client connected - ' + client.id);

  client.emit('master_ready', chartData);

  cacheItem(client, clients, function() {
    console.log('client cached & ready to emit');
  });

  client.on('force_disconnect', function() {
    client.disconnect();
  });

  client.on('disconnect', function() {
    delete clients[client.id];
    console.log('client disconnected');
  });

  client.on('client_vote', function(data) {
    console.log('client try to vote');
    for (var id in masters) {
      masters[id].emit('client_vote', data);
    }
  });
});

app.configure(function() {
  [ 'css', 'js', 'images', 'plugin', 'lib' ].forEach(function(dir) {
    app.use('/' + dir, staticDir(opts.baseDir + dir));
  });
});

app.get("/", function(req, res) {
  fs.createReadStream(opts.baseDir + '/index.html').pipe(res);
});

app.get("/client", function(req, res) {
  fs.createReadStream(opts.baseDir + 'plugin/repoll-server/client.html').pipe(res);
});

app.get("/notes/:socketId", function(req, res) {

  fs.readFile(opts.baseDir + 'plugin/notes-server/notes.html', function(err, data) {
    res.send(Mustache.to_html(data.toString(), {
      socketId : req.params.socketId
    }));
  });
  // fs.createReadStream(opts.baseDir + 'notes-server/notes.html').pipe(res);
});

// Actually listen
app.listen(opts.port || null);

var brown = '\033[33m',
  green = '\033[32m',
  reset = '\033[0m';

var slidesLocation = "http://localhost" + ( opts.port ? ( ':' + opts.port ) : '' );
var clientLocation = "http://localhost" + ( opts.port ? ( ':' + opts.port ) : '' ) + "/client";

console.log( brown + "reveal.js - Repoll" + reset );
console.log( "1. Open the slides at " + green + slidesLocation + reset );
console.log( "2. share client app with " + brown + clientLocation + reset );
console.log( "3. Advance through your slides and your notes will advance automatically" );