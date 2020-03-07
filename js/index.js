import _reveal from './reveal.js'

// The Reveal class can be instantiated to run multiple
// presentations on the same page
window.Reveal = _reveal;

// Simplified way to create a reveal.js instance on
// a page with only one presentation, makes us backwards
// compatible with reveal.js pre 4.0
window.Reveal.initialize = options => {
	window.Reveal = new _reveal( document.querySelector( '.reveal' ), options );
}