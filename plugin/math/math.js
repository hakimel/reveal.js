/**
 * A plugin which enables rendering of math equations inside
 * of reveal.js slides. Essentially a thin wrapper for MathJax.
 *
 * @author Hakim El Hattab
 */
var RevealMath = window.RevealMath || (function(){

	var loaded = false;

	var config = Reveal.getConfig().math || {};
	config.mode = config.mode || 'TeX-AMS_HTML-full';

	var head = document.querySelector( 'head' );
	var script = document.createElement( 'script' );
	script.type = 'text/javascript';
	script.src = 'http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=' + config.mode;

	// Detect when the script has loaded
	script.onload = onScriptLoad;

	// IE
	script.onreadystatechange = function() {
		if ( this.readyState === 'loaded' ) {
			onScriptLoad.call();
		}
	}

	// Normal browsers
	head.appendChild( script );

	function onScriptLoad() {

		// Conditioned just in case both onload and readystate fire
		if( loaded === false ) {
			loaded = true;

			MathJax.Hub.Config({
				messageStyle: 'none',
				tex2jax: { inlineMath: [['$','$'],['\\(','\\)']] }
			});

			// Process any math inside of the current slide when navigating,
			// this is needed since it's not possible to typeset equations
			// within invisible elements (far future or past).
			Reveal.addEventListener( 'slidechanged', function( event ) {

				// This will only typeset equations that have not yet been
				// processed, as well as equations that have change since
				// last being processed.
				MathJax.Hub.Update( event.currentSlide );

			} );
		}

	}

})();
