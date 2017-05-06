(function() {
	// for the moment make it only possible to mvoe forward
	// because it often misdetects the wave direction
	var webcamSwipeEnabled = true;
	document.getElementsByTagName("body")[0].addEventListener( 'webcamSwipeRight',  function() {
		if (webcamSwipeEnabled) {
			Reveal.navigateNext();
			// disable swiping for 1 second to avoid "double firing" of the event
			webcamSwipeEnabled = false;
			setTimeout(function(){ webcamSwipeEnabled = true}, 1000);
		}
	});
	window.initializeWebcamSwiper();
}());
