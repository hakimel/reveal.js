import Presentation from './reveal.js'

window.Reveal = Presentation;

// Provides a backwards compatible way to initialize
// reveal.js when there is only one presentation on
// the page.
//
// Reveal.initialize({ controls: false })
// Reveal.slide(2)
window.Reveal.initialize = options => {
	window.Reveal = new Presentation( document.querySelector( '.reveal' ), options );
	return window.Reveal.initialize();
}