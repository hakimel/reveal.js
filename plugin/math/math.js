/**
 * A plugin which enables rendering of math equations inside
 * of reveal.js slides. Essentially a thin wrapper for MathJax.
 *
 * @author Hakim El Hattab
 */
var RevealMath = window.RevealMath || (function(){

	var loaded = false;

	var config = Reveal.getConfig().math || {};
	config.host = config.host || 'http://cdn.mathjax.org/mathjax/latest/MathJax.js';
	config.mode = config.mode || 'TeX-AMS_HTML-full';

	loadScript( config.host + '?config=' + config.mode, function() {

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
				MathJax.Hub.Update( event.currentSlide, function() {
					Reveal.layout();
				} );

			} );
		}

	} );

	function loadScript( url, callback ) {

		var head = document.querySelector( 'head' );
		var script = document.createElement( 'script' );
		script.type = 'text/javascript';
		script.src = url;

		// Wrapper for callback to make sure it only fires once
		var finish = function() {
			if( typeof callback === 'function' ) {
				callback.call();
				callback = null;
			}
		}

		script.onload = finish;

		// IE
		script.onreadystatechange = function() {
			if ( this.readyState === 'loaded' ) {
				finish.call();
			}
		}

		// Normal browsers
		head.appendChild( script );

	}

})();
