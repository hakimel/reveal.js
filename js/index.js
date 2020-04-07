import Presentation from './reveal.js'

/**
 * Expose the Reveal class to the window. To create a
 * new instance:
 * let deck = new Reveal( document.querySelector( '.reveal' ), {
 *   controls: false
 * } );
 * deck.initialize().then(() => {
 *   // reveal.js is ready
 * });
 */
window.Reveal = Presentation;


/**
 * The below is a thin shell that mimics the pre 4.0
 * reveal.js API and ensures backwards compatibility.
 * This API only allows for once Reveal instance per
 * page, whereas the new API above lets you run many
 * presentations on the same page.
 *
 * Reveal.initialize( { controls: false } ).then(() => {
 *   // reveal.js is ready
 * });
 */

let enqueuedAPICalls = [];

window.Reveal.initialize = options => {

	// Create our singleton reveal.js instance
	window.Reveal = new Presentation( document.querySelector( '.reveal' ), options );

	// Invoke any enqueued API calls
	enqueuedAPICalls.map( method => method( window.Reveal ) );

	return window.Reveal.initialize();

}

/**
 * The pre 4.0 API let you add event listener before
 * initializing. We maintain the same behavior by
 * queuing up early API calls and invoking all of them
 * when Reveal.initialize is called.
 */
[ 'on', 'off', 'addEventListener', 'removeEventListener' ].forEach( method => {
	window.Reveal[method] = ( ...args ) => {
		enqueuedAPICalls.push( deck => deck[method].call( null, ...args ) );
	}
} );