// START CUSTOM REVEAL.JS INTEGRATION
var bibliographySlides = document.querySelectorAll( '#reveal-bibliography' );
var footnotes = document.querySelectorAll( 'note' );

if (footnotes.length > 0 && bibliographySlides.length > 0) {
	var bibliography =  document.createElement('ol');
	for (var i = 0; i < footnotes.length; i++) {
		var item =  document.createElement('li');
		item.innerHTML = footnotes.item(i).innerHTML
		bibliography.appendChild(item);
	};

	var bibliographySlide = bibliographySlides.item(0);
	bibliographySlide.appendChild(bibliography);
}
// END CUSTOM REVEAL.JS INTEGRATION


