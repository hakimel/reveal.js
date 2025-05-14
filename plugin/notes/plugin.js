import speakerViewHTML from './speaker-view.html'

import { marked } from 'marked';

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
const Plugin = () => {

	let connectInterval;
	let speakerWindow = null;
	let deck;

	/**
	 * Opens a new speaker view window.
	 */
	function openSpeakerWindow() {

		// If a window is already open, focus it
		if( speakerWindow && !speakerWindow.closed ) {
			speakerWindow.focus();
		}
		else {
			speakerWindow = window.open( 'about:blank', 'reveal.js - Notes', 'width=1100,height=700' );
			speakerWindow.marked = marked;
			speakerWindow.document.write( speakerViewHTML );

			if( !speakerWindow ) {
				alert( 'Speaker view popup failed to open. Please make sure popups are allowed and reopen the speaker view.' );
				return;
			}

			connect();
		}

	}

	/**
	 * Reconnect with an existing speaker view window.
	 */
	function reconnectSpeakerWindow( reconnectWindow ) {

		if( speakerWindow && !speakerWindow.closed ) {
			speakerWindow.focus();
		}
		else {
			speakerWindow = reconnectWindow;
			window.addEventListener( 'message', onPostMessage );
			onConnected();
		}

	}

	/**
		* Connect to the notes window through a postmessage handshake.
		* Using postmessage enables us to work in situations where the
		* origins differ, such as a presentation being opened from the
		* file system.
		*/
	function connect() {

		const presentationURL = deck.getConfig().url;

		const url = typeof presentationURL === 'string' ? presentationURL :
								window.location.protocol + '//' + window.location.host + window.location.pathname + window.location.search;

		// Keep trying to connect until we get a 'connected' message back
		connectInterval = setInterval( function() {
			speakerWindow.postMessage( JSON.stringify( {
				namespace: 'reveal-notes',
				type: 'connect',
				state: deck.getState(),
				url
			} ), '*' );
		}, 500 );

		window.addEventListener( 'message', onPostMessage );

	}

	/**
	 * Calls the specified Reveal.js method with the provided argument
	 * and then pushes the result to the notes frame.
	 */
	function callRevealApi( methodName, methodArguments, callId ) {

		let result = deck[methodName].apply( deck, methodArguments );
		speakerWindow.postMessage( JSON.stringify( {
			namespace: 'reveal-notes',
			type: 'return',
			result,
			callId
		} ), '*' );

	}

	/**
	 * Posts the current slide data to the notes window.
	 */
	function post( event ) {

		let slideElement = deck.getCurrentSlide(),
			notesElements = slideElement.querySelectorAll( 'aside.notes' ),
			fragmentElement = slideElement.querySelector( '.current-fragment' );

		let messageData = {
			namespace: 'reveal-notes',
			type: 'state',
			notes: '',
			markdown: false,
			whitespace: 'normal',
			state: deck.getState()
		};

		// Look for notes defined in a slide attribute
		if( slideElement.hasAttribute( 'data-notes' ) ) {
			messageData.notes = slideElement.getAttribute( 'data-notes' );
			messageData.whitespace = 'pre-wrap';
		}

		// Look for notes defined in a fragment
		if( fragmentElement ) {
			let fragmentNotes = fragmentElement.querySelector( 'aside.notes' );
			if( fragmentNotes ) {
				messageData.notes = fragmentNotes.innerHTML;
				messageData.markdown = typeof fragmentNotes.getAttribute( 'data-markdown' ) === 'string';

				// Ignore other slide notes
				notesElements = null;
			}
			else if( fragmentElement.hasAttribute( 'data-notes' ) ) {
				messageData.notes = fragmentElement.getAttribute( 'data-notes' );
				messageData.whitespace = 'pre-wrap';

				// In case there are slide notes
				notesElements = null;
			}
		}

		// Look for notes defined in an aside element
		if( notesElements ) {
			messageData.notes = Array.from(notesElements).map( notesElement => notesElement.innerHTML ).join( '\n' );
			messageData.markdown = notesElements[0] && typeof notesElements[0].getAttribute( 'data-markdown' ) === 'string';
		}

		speakerWindow.postMessage( JSON.stringify( messageData ), '*' );

	}

	/**
	 * Check if the given event is from the same origin as the
	 * current window.
	 */
	function isSameOriginEvent( event ) {

		try {
			return window.location.origin === event.source.location.origin;
		}
		catch ( error ) {
			return false;
		}

	}

	function onPostMessage( event ) {

		// Only allow same-origin messages
		// (added 12/5/22 as a XSS safeguard)
		if( isSameOriginEvent( event ) ) {

			let data = JSON.parse( event.data );
			if( data && data.namespace === 'reveal-notes' && data.type === 'connected' ) {
				clearInterval( connectInterval );
				onConnected();
			}
			else if( data && data.namespace === 'reveal-notes' && data.type === 'call' ) {
				callRevealApi( data.methodName, data.arguments, data.callId );
			}

		}

	}

	/**
	 * Called once we have established a connection to the notes
	 * window.
	 */
	function onConnected() {

		// Monitor events that trigger a change in state
		deck.on( 'slidechanged', post );
		deck.on( 'fragmentshown', post );
		deck.on( 'fragmenthidden', post );
		deck.on( 'overviewhidden', post );
		deck.on( 'overviewshown', post );
		deck.on( 'paused', post );
		deck.on( 'resumed', post );

		// Post the initial state
		post();

	}

	return {
		id: 'notes',

		init: function( reveal ) {

			deck = reveal;

			if( !/receiver/i.test( window.location.search ) ) {

				// If the there's a 'notes' query set, open directly
				if( window.location.search.match( /(\?|\&)notes/gi ) !== null ) {
					openSpeakerWindow();
				}
				else {
					// Keep listening for speaker view hearbeats. If we receive a
					// heartbeat from an orphaned window, reconnect it. This ensures
					// that we remain connected to the notes even if the presentation
					// is reloaded.
					window.addEventListener( 'message', event => {

						if( !speakerWindow && typeof event.data === 'string' ) {
							let data;

							try {
								data = JSON.parse( event.data );
							}
							catch( error ) {}

							if( data && data.namespace === 'reveal-notes' && data.type === 'heartbeat' ) {
								reconnectSpeakerWindow( event.source );
							}
						}
					});
				}

				// Open the notes when the 's' key is hit
				deck.addKeyBinding({keyCode: 83, key: 'S', description: 'Speaker notes view'}, function() {
					openSpeakerWindow();
				} );

			}

		},

		open: openSpeakerWindow
	};

};

export default Plugin;
