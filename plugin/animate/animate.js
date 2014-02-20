/*****************************************************************
** Allows to trigger animation of svg. The svg must provide the 
** following interface: 
    document.next = function() {
	// start animation when fragment is shown
    }
    document.prev = function() {
	// start animation when fragment is hidden
    }

** The slide must include an svg in an object or iframe with an id.
** When specifying the fragment this id must be given in the
** data-svg attribute. E.g.
**
** <object id="svg1" data="test.svg" ></object>
** <div class="fragment" data-animate="svg1">Click</div>
******************************************************************/

(function(){
	Reveal.addEventListener( 'fragmentshown', function( event ) {
		if ( event.fragment.dataset.animate != undefined ) {
			document.getElementById( event.fragment.dataset.animate ).contentDocument.next();
		}
	} );

	Reveal.addEventListener( 'fragmenthidden', function( event ) {
		if ( event.fragment.dataset.animate != undefined ) {
			document.getElementById( event.fragment.dataset.animate ).contentDocument.prev();
		}
	} );
})();
