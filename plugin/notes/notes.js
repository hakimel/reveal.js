/**
 * Handles opening of and synchronization with the reveal.js
 * notes window.
 */
var RevealNotes = (function() {

	function openNotes() {
		var notesPopup = window.open( 'plugin/notes/notes.html', 'reveal.js - Notes', 'width=1120,height=850' );

		// Fires when slide is changed
		Reveal.addEventListener( 'slidechanged', function( event ) {
			post('slidechanged');
		} );

		// Fires when a fragment is shown
		Reveal.addEventListener( 'fragmentshown', function( event ) {
			post('fragmentshown');
		} );

		// Fires when a fragment is hidden
		Reveal.addEventListener( 'fragmenthidden', function( event ) {
			post('fragmenthidden');
		} );

		/**
		 * @description	Posts the current slide data to the notes window
		 *
		 * @param       {string} eventType Expecting 'slidechanged', 'fragmentshown' or 'fragmenthidden'
		 *                                 set in the events above to define the needed slideDate.
		 */
		function post(eventType) {
			var slideElement = Reveal.getCurrentSlide(),
				indexh = Reveal.getIndices().h,
				indexv = Reveal.getIndices().v,
				notes = slideElement.querySelector( 'aside.notes' ),
				nextindexh,
				nextindexv,
				slideData;

			if( slideElement.nextElementSibling && slideElement.parentNode.nodeName == 'SECTION' ) {
				nextindexh = indexh;
				nextindexv = indexv + 1;
			} else {
				nextindexh = indexh + 1;
				nextindexv = 0;
			}

			if (eventType === 'slidechanged') {
				slideData = {
					notes : notes ? notes.innerHTML : '',
					indexh : indexh,
					indexv : indexv,
					nextindexh : nextindexh,
					nextindexv : nextindexv,
					markdown : notes ? typeof notes.getAttribute( 'data-markdown' ) === 'string' : false
				};
			}
			else if (eventType === 'fragmentshown') {
				slideData = {
					fragment : 'next'
				};
			}
			else if (eventType === 'fragmenthidden') {
				slideData = {
					fragment : 'prev'
				};
			}

			notesPopup.postMessage( JSON.stringify( slideData ), '*' );
		}

		// The main presentation is kept in sync when navigating the
		// note slides so that the popup may be used as a remote
		window.addEventListener( 'message', function( event ) {
			var data = JSON.parse( event.data );

			if( data && typeof data.indexh === 'number' && typeof data.indexv === 'number' ) {
				Reveal.slide( data.indexh, data.indexv );
			}
		} );

		// Navigate to the current slide when the notes are loaded
		notesPopup.addEventListener( 'load', function( event ) {
			post('slidechanged');
		}, false );
	}

	// If the there's a 'notes' query set, open directly
	if( window.location.search.match(/(\?|\&)notes/gi ) !== null ) {
		openNotes();
	}

	// Open the notes when the 's' key is hit
	document.addEventListener( 'keydown', function( event ) {
		// Disregard the event if the target is editable or a
		// modifier is present
		if ( document.querySelector( ':focus' ) !== null || event.shiftKey || event.altKey || event.ctrlKey || event.metaKey ) return;

		if( event.keyCode === 83 ) {
			event.preventDefault();
			openNotes();
		}
	}, false );

	return { open: openNotes };
})();
