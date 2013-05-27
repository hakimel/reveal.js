//기존 코드
/*
(function() {
  console.log("repoll loaded");
  head.js(
    window.location.origin + '/socket.io/socket.io.js',
    'https://raw.github.com/nnnick/Chart.js/master/Chart.min.js',
    function() {
      var ctx = document.getElementById("myChart").getContext("2d");
      var chart = new Chart(ctx);

      var chartData = [
        {
          value : 0,
          color : "#F38630",
          desc : "java"
        },
        {
          value : 0,
          color : "#E0E4CC",
          desc : "javascript"
        },
        {
          value : 0,
          color : "#69D2E7",
          desc : "ruby"
        }
      ];
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
        console.log("client_vote event");
        chartData[data.selected].value += 1;
        chart.Pie(chartData);
      });

      window.onbeforeunload = function() {
        sio.emit('force_disconnect');
      }
    }
  );
})();
*/

//Reveal.js 와의 연동처리 부분
(function() {
  "use strict";

  var W = window;
	    //isEnabled = true;

  W.repoll = (function() {

		var pollServer = "",
        server = "/master",
        currentSlide;

		var getSurveyInfo = function (slideEl) {

      var titleEle = slideEl.querySelector(".repoll-title"),
          pollOptions = slideEl.querySelector(".repoll-options"),
          resultArea = slideEl.querySelector(".repoll-result");

      var opts = Array.prototype.slice.call(pollOptions.children);

			return {
				title : titleEle.innerHTML,
        viewType: resultArea.dataset.viewType,
				options : opts.map(function(v, i) {
          return {
            text: v.innerHTML,
            index: i
          }
        })
			};
		};

    var connect = function(initData) {

      head.js(
        '/socket.io/socket.io.js',
        function() {
          var sio = io.connect(pollServer + server);
          sio.on('connect', function() {
            console.log('socket.io connected');
          });
          sio.emit('master_ready', initData);
        }
      );
    };

		var sendToServer = function (surveyInfo) {
      console.log("surveyInfo " + JSON.stringify(surveyInfo));
			// 소켓 구현

      connect(surveyInfo);
		};

		var listenToServer = function() {
			// 소켓 받는다.

			//render()
		};

		var render = function (data) {
			var containerEl;
			// 데이터 예시
			// data = [
			// 	"options1" : 2,
			// 	"options2" : 2,
			// 	"options3" : 2,
			// 	"options4" : 2,
			// 	"options5" : 2,
			// 	"options6" : 2,
			// 	"options6" : 2
			// ];

			// repoll-result
			containerEl	 = currentSlide.querySelector(".repoll-result");

			// ?????.render(contains,data);
		};

		var init = function(slide) {
			currentSlide = slide;
			sendToServer(getSurveyInfo(currentSlide));
			listenToServer();
		};

		return {
			init : init
		};

	})();

	if (Reveal.getCurrentSlide().classList.contains("repoll")) {
		repoll.init(Reveal.getCurrentSlide());
	}

	Reveal.addEventListener( 'slidechanged', function( event ) {
    if(event.currentSlide.classList.contains("repoll")){
    	repoll.init(Reveal.getCurrentSlide());
    }
	});

  Reveal.addEventListener( 'overviewshown', function(event) { } );
  Reveal.addEventListener( 'overviewhidden', function(event) { } );

})();
