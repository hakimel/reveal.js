/**
 * Handles opening of and synchronization with the reveal.js
 * notes window.
 */
var RevealNotes = (function() {

	function openNotes() {
		var jsFileLocation = document.querySelector('script[src$="notes.js"]').src;  // this js file path
		jsFileLocation = jsFileLocation.replace(/notes\.js(\?.*)?$/, '');   // the js folder path
		var notesPopup = window.open( jsFileLocation + 'notes.html', 'reveal.js - Notes', 'width=1120,height=850' );

		// Fires when slide is changed
		Reveal.addEventListener( 'slidechanged', post );

		// Fires when a fragment is shown
		Reveal.addEventListener( 'fragmentshown', post );

		// Fires when a fragment is hidden
		Reveal.addEventListener( 'fragmenthidden', post );

		/**
		 * Posts the current slide data to the notes window
		 */
		function post() {
			var slideElement = Reveal.getCurrentSlide(),
				slideIndices = Reveal.getIndices(),
				messageData;

			var notes = slideElement.querySelector( 'aside.notes' ),
				nextindexh,
				nextindexv;

			if( slideElement.nextElementSibling && slideElement.parentNode.nodeName == 'SECTION' ) {
				nextindexh = slideIndices.h;
				nextindexv = slideIndices.v + 1;
			} else {
				nextindexh = slideIndices.h + 1;
				nextindexv = 0;
			}

			messageData = {
				notes : notes ? notes.innerHTML : '',
				indexh : slideIndices.h,
				indexv : slideIndices.v,
				indexf : slideIndices.f,
				nextindexh : nextindexh,
				nextindexv : nextindexv,
				markdown : notes ? typeof notes.getAttribute( 'data-markdown' ) === 'string' : false
			};

			notesPopup.postMessage( JSON.stringify( messageData ), '*' );
		}

		// Navigate to the current slide when the notes are loaded
		notesPopup.addEventListener( 'load', function( event ) {
			post();
		}, false );
	}

	// If the there's a 'notes' query set, open directly
	if( window.location.search.match( /(\?|\&)notes/gi ) !== null ) {
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
