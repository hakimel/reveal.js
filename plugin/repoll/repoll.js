//Reveal.js와의 연동처리 부분
(function(){
	var isEnabled = true;
  //repoll 모듈
	var repoll = (function() {
		var currentSlide;

		function getSurveyInfo(slideEl){
			//currentSlide 이걸로

			return {
				title : "", //String
				options : [
					{
						text : ""
					}
				]
			};
		}

		function sendToServer (surveyInfo) {
			// 소켓 구현	
		}

		function listenToServer() {
			// 소켓 받는다.

			//render()
		}

		function render (data) {
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
		}

		function init (slide) {
			currentSlide = slide;
			options = slide.dataset;

			sendToServer(getSurveyInfo(slideEl));
			listenToServer();
		}

		return {
			init : init
		};
	})();

	if (Reveal.getCurrentSlide().classList.contains("repoll")) {
		repoll.init(Reveal.getCurrentSlide());
	};

	Reveal.addEventListener( 'slidechanged', function( event ) {
    if(event.currentSlide.classList.contains("repoll")){
    	repoll.init(Reveal.getCurrentSlide());
    }
	});

  Reveal.addEventListener( 'overviewshown', function(event) { } );
  Reveal.addEventListener( 'overviewhidden', function(event) { } );

})();

