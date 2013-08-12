/**
 * A plugin which enables rendering of math equations inside
 * of reveal.js slides. Essentially a thin wrapper for MathJax.
 *
 * @author Hakim El Hattab
 */
(function(){

	var head = document.querySelector( 'head' );
	var script = document.createElement( 'script' );
	script.type = 'text/javascript';
	script.src = 'http://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_SVG-full';

	// Detect when the script has loaded
	script.onload = onScriptLoad;
	script.onreadystatechange = function() {
		if ( this.readyState === 'loaded' ) {
			onScriptLoad.call();
		}
	}

	head.appendChild( script );

	function onScriptLoad() {

		MathJax.Hub.Config({
			messageStyle: 'none',
			tex2jax: { inlineMath: [['$','$'],['\\(','\\)']] }
		});

		Reveal.addEventListener( 'slidechanged', function( event ) {
			MathJax.Hub.Update( event.currentSlide );
		} );

	}

})();
