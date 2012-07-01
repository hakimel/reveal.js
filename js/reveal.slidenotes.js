(function() {
	// don't emit events from inside the previews themselves
	var qs = window.location.href.split('?');
	if (qs.length > 1 && qs[1].match('receiver')) { return; }

	var socket = io.connect(window.location.origin);
	var socketId = Math.random().toString().slice(2);
	console.log('View slide notes at ' + window.location.origin + '/_notes/' + socketId);

	Reveal.addEventListener( 'slidechanged', function( event ) {
		var nextindexh;
		var nextindexv;
		var slideElement = event.currentSlide;

		if (slideElement.nextElementSibling && slideElement.parentNode.nodeName == 'SECTION') {
			nextindexh = event.indexh;
			nextindexv = event.indexv + 1;
		} else {
			nextindexh = event.indexh + 1;
			nextindexv = 0;
		}

		var notes = slideElement.querySelector('aside.notes');
		var slideData = {
			notes : notes ? notes.innerHTML : '',
			indexh : event.indexh,
			indexv : event.indexv,
			nextindexh : nextindexh,
			nextindexv : nextindexv,
			socketId : socketId
		};

		socket.emit('slidechanged', slideData);
	} );
}());
