/**
 * Handles opening of and synchronization with the reveal.js
 * notes window.
 *
 * Handshake process:
 * 1. This window posts 'connect' to notes window
 *    - Includes URL of presentation to show
 * 2. Notes window responds with 'connected' when it is available
 * 3. This window proceeds to send the current presentation state
 *    to the notes window
 */
var RevealNotes = (function() {

	function openNotes( notesFilePath ) {

		if( !notesFilePath ) {
			var jsFileLocation = document.querySelector('script[src$="notes.js"]').src;  // this js file path
			jsFileLocation = jsFileLocation.replace(/notes\.js(\?.*)?$/, '');   // the js folder path
			notesFilePath = jsFileLocation + 'notes.html';
		}

		var notesPopup = window.open( notesFilePath, 'reveal.js - Notes', 'width=1100,height=700' );

		if( !notesPopup ) {
			alert( 'Speaker view popup failed to open. Please make sure popups are allowed and reopen the speaker view.' );
			return;
		}

		// Allow popup window access to Reveal API
		notesPopup.Reveal = this.Reveal;

		/**
		 * Connect to the notes window through a postmessage handshake.
		 * Using postmessage enables us to work in situations where the
		 * origins differ, such as a presentation being opened from the
		 * file system.
		 */
		function connect() {
			// Keep trying to connect until we get a 'connected' message back
			var connectInterval = setInterval( function() {
				notesPopup.postMessage( JSON.stringify( {
					namespace: 'reveal-notes',
					type: 'connect',
					url: window.location.protocol + '//' + window.location.host + window.location.pathname + window.location.search,
					state: Reveal.getState()
				} ), '*' );
			}, 500 );

			window.addEventListener( 'message', function( event ) {
				var data = JSON.parse( event.data );
				if( data && data.namespace === 'reveal-notes' && data.type === 'connected' ) {
					clearInterval( connectInterval );
					onConnected();
				}
			} );
		}

		/**
		 * Posts the current slide data to the notes window
		 */
		function post( event ) {

			var slideElement = Reveal.getCurrentSlide(),
				notesElement = slideElement.querySelector( 'aside.notes' ),
				fragmentElement = slideElement.querySelector( '.current-fragment' );

			var messageData = {
				namespace: 'reveal-notes',
				type: 'state',
				notes: '',
				markdown: false,
				whitespace: 'normal',
				state: Reveal.getState()
			};

			// Look for notes defined in a slide attribute
			if( slideElement.hasAttribute( 'data-notes' ) ) {
				messageData.notes = slideElement.getAttribute( 'data-notes' );
				messageData.whitespace = 'pre-wrap';
			}

			// Look for notes defined in a fragment
			if( fragmentElement ) {
				var fragmentNotes = fragmentElement.querySelector( 'aside.notes' );
				if( fragmentNotes ) {
					notesElement = fragmentNotes;
				}
				else if( fragmentElement.hasAttribute( 'data-notes' ) ) {
					messageData.notes = fragmentElement.getAttribute( 'data-notes' );
					messageData.whitespace = 'pre-wrap';

					// In case there are slide notes
					notesElement = null;
				}
			}

			// Look for notes defined in an aside element
			if( notesElement ) {
				messageData.notes = notesElement.innerHTML;
				messageData.markdown = typeof notesElement.getAttribute( 'data-markdown' ) === 'string';
			}

			notesPopup.postMessage( JSON.stringify( messageData ), '*' );

		}

		/**
		 * Called once we have established a connection to the notes
		 * window.
		 */
		function onConnected() {

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

		}

		connect();

	}

	if( !/receiver/i.test( window.location.search ) ) {

		// If the there's a 'notes' query set, open directly
		if( window.location.search.match( /(\?|\&)notes/gi ) !== null ) {
			openNotes();
		}

		// Open the notes when the 's' key is hit
		Reveal.addKeyBinding({keyCode: 83, key: 'S', description: 'Speaker notes view'}, function() {
			openNotes();
		} );

	}

	return { open: openNotes };

})();
