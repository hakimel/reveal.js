// START CUSTOM REVEAL.JS INTEGRATION
(function() {
	function setFootnotePerSlide( event ) {
		var footer = document.querySelectorAll( 'footer#footnotes' ).item(0);
		while (footer.firstChild) {
		    footer.removeChild(footer.firstChild);
		}

    	footnotes = event.currentSlide.getElementsByTagName("note");

    	if (footnotes.length > 0) {
    		var elem = footnotes.item(0);
    		footer.appendChild(elem.cloneNode(true));
    	}
	}

	var body = document.querySelectorAll( 'body' ).item(0);
	var footer = document.createElement('footer');
	footer.setAttribute('id', 'footnotes');
	body.appendChild(footer);

	Reveal.addEventListener( 'slidechanged', setFootnotePerSlide );
	Reveal.addEventListener( 'ready', setFootnotePerSlide );
	
})();
// END CUSTOM REVEAL.JS INTEGRATION
