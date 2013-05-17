(function() {
  console.log("repoll loaded");
  var ctx = document.getElementById("myChart").getContext("2d");
  var chart = new Chart(ctx);

  var chartData = {};
  var sio = io.connect(window.location.origin + '/master');

  sio.on('error', function() {
    var host = sio.socket.options.host;
    console.log('error connect to ' + host);
  });

  sio.on('connect', function() {
    console.log('socket.io connected to ' + sio.socket.options.host);
    sio.emit('master_ready', JSON.stringify(chartData));
  });

  sio.on('client_vote', function(data) {
    console.dir(data);
    console.log("client_vote event");
    chart.Pie(data);
  });

  window.onbeforeunload = function() {
    sio.emit('force_disconnect');
  }
})();