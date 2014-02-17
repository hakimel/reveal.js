(function() {
	// don't emit events from inside the previews themselves
	if( window.location.search.match( /receiver/gi ) ) { return; }

	var socket = io.connect( window.location.origin );
	var socketId = Math.random().toString().slice( 2 );

	console.log( 'View slide notes at ' + window.location.origin + '/notes/' + socketId );

	window.open( window.location.origin + '/notes/' + socketId, 'notes-' + socketId );

	// Fires when a fragment is shown
	Reveal.addEventListener( 'fragmentshown', function( event ) {
		var fragmentData = {
			fragment : 'next',
			socketId : socketId
		};
		socket.emit('fragmentchanged', fragmentData);
	} );

	// Fires when a fragment is hidden
	Reveal.addEventListener( 'fragmenthidden', function( event ) {
		var fragmentData = {
			fragment : 'previous',
			socketId : socketId
		};
		socket.emit( 'fragmentchanged', fragmentData );
	} );

	// Fires when slide is changed
	Reveal.addEventListener( 'slidechanged', function( event ) {
		var nextindexh,
			nextindexv,
			slideElement = event.currentSlide,
			notesElement = slideElement.querySelector( 'aside.notes' );

		if( slideElement.nextElementSibling && slideElement.parentNode.nodeName == 'SECTION' ) {
			nextindexh = event.indexh;
			nextindexv = event.indexv + 1;
		} else {
			nextindexh = event.indexh + 1;
			nextindexv = 0;
		}

		var messageData = {
			notes : '',
			indexh : event.indexh,
			indexv : event.indexv,
			nextindexh : nextindexh,
			nextindexv : nextindexv,
			socketId : socketId,
			markdown : false
		};

		// Look for notes defined in a slide attribute
		if( slideElement.hasAttribute( 'data-notes' ) ) {
			messageData.notes = slideElement.getAttribute( 'data-notes' );
		}

		// Look for notes defined in an aside element
		if( notesElement ) {
			messageData.notes = notesElement.innerHTML;
			messageData.markdown = typeof notesElement.getAttribute( 'data-markdown' ) === 'string';
		}

		socket.emit( 'slidechanged', messageData );
	} );
}());
