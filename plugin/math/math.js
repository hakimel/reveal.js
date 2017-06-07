/**
 * A plugin which enables rendering of math equations inside
 * of reveal.js slides. Essentially a thin wrapper for MathJax.
 *
 * @author Hakim El Hattab
 */
var RevealMath = window.RevealMath || (function(){

	var options = Reveal.getConfig().math || {};
	options.mathjax = options.mathjax || 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.0/MathJax.js';
	options.config = options.config || 'TeX-AMS_HTML-full';

	head.load( options.mathjax + '?config=' + options.config, function() {

		MathJax.Hub.Config({
			messageStyle: 'none',
			tex2jax: {
				inlineMath: [['$','$'],['\\(','\\)']] ,
				skipTags: ['script','noscript','style','textarea','pre']
			},
			skipStartupTypeset: true
		});

		// Typeset followed by an immediate reveal.js layout since
		// the typesetting process could affect slide height
		MathJax.Hub.Queue( [ 'Typeset', MathJax.Hub ] );
		MathJax.Hub.Queue( Reveal.layout );

		// Reprocess equations in slides when they turn visible
		Reveal.addEventListener( 'slidechanged', function( event ) {

			MathJax.Hub.Queue( [ 'Typeset', MathJax.Hub, event.currentSlide ] );

		} );

	} );

})();
