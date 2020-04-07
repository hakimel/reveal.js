(function() {

	// Don't emit events from inside of notes windows
	if ( window.location.search.match( /receiver/gi ) ) { return; }

	var multiplex = Reveal.getConfig().multiplex;

	var socket = io.connect( multiplex.url );

	function post() {

		var messageData = {
			state: Reveal.getState(),
			secret: multiplex.secret,
			socketId: multiplex.id
		};

		socket.emit( 'multiplex-statechanged', messageData );

	};

	// post once the page is loaded, so the client follows also on "open URL".
	window.addEventListener( 'load', post );

	// Monitor events that trigger a change in state
	Reveal.on( 'slidechanged', post );
	Reveal.on( 'fragmentshown', post );
	Reveal.on( 'fragmenthidden', post );
	Reveal.on( 'overviewhidden', post );
	Reveal.on( 'overviewshown', post );
	Reveal.on( 'paused', post );
	Reveal.on( 'resumed', post );

}());
