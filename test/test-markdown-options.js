Reveal.addEventListener( 'ready', function() {

	QUnit.module( 'Markdown' );

	QUnit.test( 'Options are set', function( assert ) {
		assert.strictEqual( marked.defaults.smartypants, true );
	});

	QUnit.test( 'Smart quotes are activated', function( assert ) {
		var text = document.querySelector( '.reveal .slides>section>p' ).textContent;

		assert.strictEqual( /['"]/.test( text ), false );
		assert.strictEqual( /[“”‘’]/.test( text ), true );
	});

} );

Reveal.initialize({
	dependencies: [
		{ src: '../plugin/markdown/marked.js' },
		// Test loading JS files with query strings
		{ src: '../plugin/markdown/markdown.js?query=string' },
	],
	markdown: {
		smartypants: true
	}
});
