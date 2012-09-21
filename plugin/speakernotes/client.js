(function() {
	// don't emit events from inside the previews themselves
	if ( window.location.search.match( /receiver/gi ) ) { return; }

	var socket = io.connect(window.location.origin);
	var socketId = Math.random().toString().slice(2);
	
	console.log('View slide notes at ' + window.location.origin + '/notes/' + socketId);
	window.open(window.location.origin + '/notes/' + socketId, 'notes-' + socketId)

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
			socketId : socketId,
			markdown : notes ? typeof notes.getAttribute('data-markdown') === 'string' : false

		};

		socket.emit('slidechanged', slideData);
	} );
}());
