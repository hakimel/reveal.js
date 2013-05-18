var express   = require('express'),
    fs        = require('fs'),
    io        = require('socket.io'),
    _         = require('underscore'),
    Mustache  = require('mustache');

var app       = express.createServer(),
    staticDir = express.static,
    io        = io.listen(app);

var opts = {
  port: 1984,
  baseDir: __dirname + '/../../'
};


var path = {
      root: opts.baseDir,
      noteDir: opts.baseDir + 'plugin/notes-server/',
      repollDir: opts.baseDir + 'plugin/repoll-server/'
    },
    masters = {},
    clients = {},
    chartData = {},
    isMasterReady = false;

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
    chartData = {};
    console.log('master disconnected');
    _.each(clients, function(client, id) { 
      client.emit('master_lost', {});
    });
  });

  master.on('force_disconnect', function() {
    master.disconnect();
  });

  master.on('master_ready', function(masterData) {
    console.log('master ready event ' + masterData);
    chartData = masterData;
    isMasterReady = true;
    _.each(clients, function(client, id) { 
      client.emit('master_ready', chartData);
    });
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
    _.each(masters, function(master, id) { 
      master.emit('client_vote', data);
    });
  });
});

app.configure(function() {
  [ 'css', 'js', 'images', 'plugin', 'lib' ].forEach(function(dir) {
    app.use('/' + dir, staticDir(opts.baseDir + dir));
  });
  app.use(express.logger());
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

var Handler = {
  index: function(req, res, next) {
    fs.createReadStream(path.root + '/index.html').pipe(res);
  },
  client: function(req, res, next) {
    fs.createReadStream(path.repollDir + '/client.html').pipe(res);
  },
  infomation: function(req, res, next) {
    fs.readFile(path.repollDir + '/infomation.html', function(err, data) {
      res.send(Mustache.to_html(data.toString(), {
        isMasterReady: isMasterReady,
        opts: opts,
        masters: masters,
        clients: clients
      }));
    });
  },
  note: function(req, res, next) {
    fs.readFile(path.noteDir + '/notes.html', function(err, data) {
      res.send(Mustache.to_html(data.toString(), {
        socketId : req.params.socketId
      }));
    });
  }
};

var RouteMap = [
  { url: "/", handler: Handler.index },
  { url: "/client", handler: Handler.client },
  { url: "/infomation", handler: Handler.infomation },
  { url: "/notes/:socketId", handler: Handler.note }
];

var beforeMiddleWare = {
      parseParameter: function(req, res, next) {
        next();
      }
    },
    afterMiddleWare = {};

var k, m, route;
for (k in beforeMiddleWare) {
  if(beforeMiddleWare.hasOwnProperty(k)) {
    app.use(beforeMiddleWare[k]);
  }
}
for (m in RouteMap) {
  if(!RouteMap.hasOwnProperty(m)) {
    continue;
  }
  route = RouteMap[m];
  app[route.method || 'get'](route.url, route.handler);
};
for (k in afterMiddleWare) {
  if(afterMiddleWare.hasOwnProperty(k)) {
    app.use(afterMiddleWare[k]);
  }
}

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