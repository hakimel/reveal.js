(function() {

	// don't emit events from inside the previews themselves
	if( window.location.search.match( /receiver/gi ) ) { return; }

	var socket = io.connect( window.location.origin ),
		socketId = Math.random().toString().slice( 2 );

	console.log( 'View slide notes at ' + window.location.origin + '/notes/' + socketId );

	window.open( window.location.origin + '/notes/' + socketId, 'notes-' + socketId );

	/**
	 * Posts the current slide data to the notes window
	 */
	function post() {

		var slideElement = Reveal.getCurrentSlide(),
			notesElement = slideElement.querySelector( 'aside.notes' );

		var messageData = {
			notes: '',
			markdown: false,
			socketId: socketId,
			state: Reveal.getState()
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

		socket.emit( 'statechanged', messageData );

	}

	// When a new notes window connects, post our current state
	socket.on( 'new-subscriber', function( data ) {
		post();
	} );

	// When the state changes from inside of the speaker view
	socket.on( 'statechanged-speaker', function( data ) {
		Reveal.setState( data.state );
	} );

	// Monitor events that trigger a change in state
	Reveal.addEventListener( 'slidechanged', post );
	Reveal.addEventListener( 'fragmentshown', post );
	Reveal.addEventListener( 'fragmenthidden', post );
	Reveal.addEventListener( 'overviewhidden', post );
	Reveal.addEventListener( 'overviewshown', post );
	Reveal.addEventListener( 'paused', post );
	Reveal.addEventListener( 'resumed', post );

	// Post the initial state
	post();

}());
