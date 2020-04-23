/**
 * A plugin which enables rendering of math equations inside
 * of reveal.js slides. Essentially a thin wrapper for MathJax.
 *
 * @author Hakim El Hattab
 */
const Plugin = () => {

	// The reveal.js instance this plugin is attached to
	let deck;

	let defaultOptions = {
		messageStyle: 'none',
		tex2jax: {
			inlineMath: [ [ '$', '$' ], [ '\\(', '\\)' ] ],
			skipTags: [ 'script', 'noscript', 'style', 'textarea', 'pre' ]
		},
		skipStartupTypeset: true
	};

	function loadScript( url, callback ) {

		let head = document.querySelector( 'head' );
		let script = document.createElement( 'script' );
		script.type = 'text/javascript';
		script.src = url;

		// Wrapper for callback to make sure it only fires once
		let finish = () => {
			if( typeof callback === 'function' ) {
				callback.call();
				callback = null;
			}
		}

		script.onload = finish;

		// IE
		script.onreadystatechange = () => {
			if ( this.readyState === 'loaded' ) {
				finish();
			}
		}

		// Normal browsers
		head.appendChild( script );

	}

	return {
		id: 'math',

		init: function( reveal ) {

			deck = reveal;

			let revealOptions = deck.getConfig().math || {};

			let options = { ...defaultOptions, ...revealOptions };
			let mathjax = options.mathjax || 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js';
			let config = options.config || 'TeX-AMS_HTML-full';
			let url = mathjax + '?config=' + config;

			options.tex2jax = { ...defaultOptions.tex2jax, ...revealOptions.tex2jax };

			options.mathjax = options.config = null;

			loadScript( url, function() {

				MathJax.Hub.Config( options );

				// Typeset followed by an immediate reveal.js layout since
				// the typesetting process could affect slide height
				MathJax.Hub.Queue( [ 'Typeset', MathJax.Hub, deck.getRevealElement() ] );
				MathJax.Hub.Queue( deck.layout );

				// Reprocess equations in slides when they turn visible
				deck.on( 'slidechanged', function( event ) {

					MathJax.Hub.Queue( [ 'Typeset', MathJax.Hub, event.currentSlide ] );

				} );

			} );

		}
	}

};

export default Plugin;
