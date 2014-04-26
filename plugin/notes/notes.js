/**
 * Handles opening of and synchronization with the reveal.js
 * notes window.
 */
var RevealNotes = (function() {
	"use strict";

	function openNotes() {
		var jsFileLocation = document.querySelector('script[src$="notes.js"]').src;  // this js file path
		jsFileLocation = jsFileLocation.replace(/notes\.js(\?.*)?$/, '');   // the js folder path
		var notesPopup = window.open( jsFileLocation + 'notes.html', 'reveal.js - Notes', 'width=1120,height=850' );
	}

	// If the there's a 'notes' query set, open directly
	if( window.location.search.match( /(\?|\&)notes/gi ) !== null && !window.location.search.match( /(\?|\&)receiver/gi )) {
		openNotes();
	}

	// Open the notes when the 's' key is hit
	document.addEventListener( 'keydown', function( event ) {
		// Disregard the event if the target is editable or a
		// modifier is present
		if ( document.querySelector( '.reveal .slides section :focus' ) !== null
				|| event.shiftKey || event.altKey || event.ctrlKey || event.metaKey ) return;

		if( event.keyCode === 83 ) {
			event.preventDefault();
			openNotes();
		}
	}, false );

	return { open: openNotes };
})();

/**
 * Patch Reveal's configure() method to add
 * option 'peekNextFragments: display all upcoming Fragments
 */
(function() {
	"use strict";
	// patch Reveal's configure() method
	var _configure = Reveal.configure;
	var styleNode = document.createElement('style');

	// the initial state of the fragment, just grayed out; only works nicely for default animation (opacity change)
	styleNode.innerHTML = ".reveal .slides section .fragment:not(.visible) { opacity: 0.33 !important; }";

	Reveal.configure = function(options) {
		_configure.call(Reveal, options);
		options = Reveal.getConfig();
		if(options.peekFragments === true && !document.head.contains(styleNode)) peekFragmentsOn();
		if(options.peekFragments === false && document.head.contains(styleNode)) peekFragmentsOff();
	}
	Reveal.configure({});

	function peekFragmentsOn() {
		document.head.appendChild(styleNode);
		walkFragmentClasses(function(fragment, className) {
			fragment.classList.remove(className);
			fragment.classList.add("_" + className);
		});
	}

	function peekFragmentsOff() {
		document.head.removeChild(styleNode);
		walkFragmentClasses(function(fragment, className) {
			if(className.substring(0,1) === "_") {
				fragment.classList.remove(className);
				fragment.classList.add(className.substring(1));
			}
		});
	}

	function walkFragmentClasses(callback) {
		var fragments = document.querySelectorAll('.reveal .slides section .fragment');
		fragments = Array.prototype.slice.call(fragments);
		fragments.forEach(function(fragment) {
			var classes = Array.prototype.slice.call(fragment.classList);
			classes.forEach(function(className) {
				switch(className) {
					case "fragment":
					case "current-fragment":
					case "visible":
						break;
					default:
						callback(fragment, className);
				}
			});
		});
	}
})();

