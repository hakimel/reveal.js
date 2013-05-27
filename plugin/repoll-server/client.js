(function(WINDOW, $) {
  "use strict";

  var doc = WINDOW.document,
      // localhost
      pollServer = "",
      templateSource = $('#vote-template').html(),
      voteTemplate   = Handlebars.compile(templateSource),
      E = {
        title: ".jumbotron h2",
        voteButtons: "marketing",
        submit: ".btn.btn-large.span12"
      };

  var masterNotReady = function() {
    console.log('master not ready');
    E.title.text('No Polls Yet...');
    E.voteButtons.hide();
    E.submit.remove();
  };

  var masterReady = function(chartData) {
    E.title.text('Pick what you want!');

    if (E.voteButtons.children().length >= 1) {
      E.submit.remove();
    }

    E.voteButtons.append(voteTemplate(chartData));

    E.voteButtons.show();
    E.submit.on('click', function(e) {
      e.preventDefault();
      console.log('btn clicked!');
      var index = $(this).data('index');
      sio.emit('client_vote', {selected:index});

    });
  };

  var connect = function(callback) {
    var sio = io.connect(pollServer + '/client');

    sio.on('connect', function() {
      console.log('socket.io connected');
    });

    sio.on('master_ready', function(chartData) {
      if (!chartData.viewType) {
        masterNotReady();
        return;
      }

      console.log('master ready to vote with data!!');
      console.dir(chartData);
      masterReady(chartData);
    });

    sio.on('master_lost', function(data) {
      console.log('master lost');
      console.dir(data);
      masterNotReady();
    });

    if($.isFunction(callback)) {
      callback();
    }
  };

  var bindEvent = function(callback) {
    $(WINDOW).bind('beforeunload', function() {
      sio.emit('force_disconnect');
    });

    $(doc).on("load",function() {
      setTimeout(function() {
        window.scrollTo(0, 0);
      }, 1000);
    });

    if($.isFunction(callback)) {
      callback();
    }
  };

  var renderUI = function(callback) {
    var mapped = {};
    $.each(E, function(k, v) {
      mapped[k] =  $(v);
    });
    E = mapped;

    if($.isFunction(callback)) {
      callback();
    }
  };

  var initialize = function() {
    renderUI(bindEvent(connect));
  };

  initialize();

})(window, jQuery);