var express		= require('express');
var fs			= require('fs');
var io			= require('socket.io');
var crypto		= require('crypto');
var app			= express.createServer();
var staticDir	= express.static;
var io			= io.listen(app);

var opts = {
	port: process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 1948,
  ipAddr : process.env.IP_ADDR || process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1',
  web_host: process.env.REVEAL_WEB_HOST || process.env.OPENSHIFT_APP_DNS || 'localhost:1948',
  socket_host: process.env.REVEAL_SOCKET_HOST || process.env.OPENSHIFT_APP_DNS || 'localhost',
  socket_secret : process.env.REVEAL_SOCKET_SECRET,
	baseDir : __dirname + '/../../'
};

var createHash = function(secret) {
	var cipher = crypto.createCipher('blowfish', secret);
	return(cipher.final('hex'));
};

app.configure(function() {
	[ 'css', 'js', 'plugin', 'lib' ].forEach(function(dir) {
		app.use('/' + dir, staticDir(opts.baseDir + dir));
	});
});

app.get("/", function(req, res) {
  var data = fs.readFileSync(opts.baseDir + '/index.html');
  response = data.toString().replace(/multiplex: {}/, getClientConfig());
  res.send(response, 200, {'Content-Type': 'text/html'});
});

app.get("/token", function(req,res) {
  res.send('Information about setting up your presentation environment is available in the server logs');
});

io.sockets.on('connection', function(socket) {
  var checkAndReflect = function(data){
    if (typeof data.secret == 'undefined' || data.secret == null || data.secret === '') {console.log('Discarding mismatched socket data');return;} 
    if (createHash(data.secret) === data.socketId) {
      data.secret = null; 
      socket.broadcast.emit(data.socketId, data);
      console.dir(data);
    }else{
      console.log('Discarding mismatched socket data:');
      console.dir(data);
    };      
  };
	socket.on('slidechanged', checkAndReflect);
  socket.on('navigation', checkAndReflect);
});

var printTokenUsageInfo = function(token){
  var hostnm = opts.web_host;
  if(!process.env.OPENSHIFT_APP_NAME){
    //Printing generic hosting / local host info:
    console.log("Set your broadcast token as an environment variable and restart your server:");
    console.log("  export REVEAL_SOCKET_SECRET='"+token.socket_secret+"'");
    console.log("  npm start");
    console.log("Then, configure your browser as a presentation device by loading the following URL:");
    console.log("  http://" + hostnm + "/?setToken=" + token.socket_secret);
  }else{
    var appnm = process.env.OPENSHIFT_APP_NAME;

    //Printing OpenShift-specific usage info:
    console.log("Tell OpenShift to save this broadcast token and publish it as an environment variable:");
    console.log("  rhc env set REVEAL_SOCKET_SECRET="+token.socket_secret+" -a " + appnm);
    console.log("  rhc app restart " + appnm);
    console.log("Then, configure your browser as a presentation device by loading the following URL: ");
    console.log("  http://" + hostnm + "/?setToken=" + token.socket_secret);
  }
}

var getTokens = function(){
	var ts = new Date().getTime();
	var rand = Math.floor(Math.random()*9999999);
	var secret = opts.socket_secret || ts.toString() + rand.toString();
	var socket = createHash(secret);
  response = {"socket_secret": secret, "socket_id": socket};
  printTokenUsageInfo(response);
  return response;
};

var getClientConfig = function(){
  var tokens = getTokens();
  return "multiplex:{ id: '"+tokens.socket_id+"', url: '"+opts.socket_host+"'}";
};

// Actually listen
app.listen(opts.port, opts.ipAddr);

var brown = '\033[33m',
	green = '\033[32m',
	reset = '\033[0m';

console.log( brown + "reveal.js:" + reset + " Multiplex running on port " + green + opts.port + reset );
