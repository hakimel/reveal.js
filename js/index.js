import Presentation from './reveal.js'

// The Reveal class can be instantiated to run multiple
// presentations on the same page
//
// let rvl = new Reveal( <HTMLElement>, { controls: false } )
// rvl.initialize()
// rvl.slide(2)
window.Reveal = Presentation;

// Simplified way to create a reveal.js instance on
// a page with only one presentation, makes us backwards
// compatible with reveal.js pre 4.0
//
// Reveal.initialize({ controls: false })
// Revea.slide(2)
window.Reveal.initialize = options => {
	window.Reveal = new Presentation( document.querySelector( '.reveal' ), options );
	window.Reveal.initialize();
	return new Promise( resolve => window.Reveal.addEventListener( 'ready', resolve ) );
}