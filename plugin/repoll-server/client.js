window.addEventListener("load",function() {
  setTimeout(function() {
    window.scrollTo(0, 0);
  }, 1000);
});

var title          = $('.jumbotron h2');
var voteButtons    = $('.marketing');
var templateSource = $('#vote-template').html();
var voteTemplate   = Handlebars.compile(templateSource);

var isDebug = document.location.hostname !== 'repoll.herokuapp.com';
var sio = io.connect(isDebug ?
  'http://192.168.0.102:3000/client' :
  'http://repoll.herokuapp.com/client'
);

var masterNotReady = function() {
  console.log('master not ready');
  title.text('No Polls Yet...');
  voteButtons.hide();
  $('.btn.btn-large.span12').remove();
};

var masterReady = function(chartData) {
  title.text('Pick what you want!');

  if (voteButtons.children().length >= 1) {
    $('.btn.btn-large.span12').remove();
  }

  voteButtons.append(voteTemplate(JSON.parse(chartData)));
  voteButtons.show();
  $('.btn.btn-large.span12').on('click', function(e) {
    e.preventDefault();
    console.log('btn clicked!');
    var index = $(this).data('index');
    sio.emit('client_vote', {selected:index});

  });
};

sio.on('connect', function() {
  console.log('socket.io connected');
});

sio.on('master_ready', function(chartData) {
  if (chartData.chart && chartData.chart === 'none') {
    masterNotReady();
    return;
  }

  console.log('master ready to vote with data!!');
  console.dir(chartData);
  masterReady(chartData);
});

sio.on('master_lost', function(data) {
  console.log('master lost');
  masterNotReady();
});

window.onbeforeunload = function() {
  sio.emit('force_disconnect');
}