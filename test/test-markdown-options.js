Reveal.addEventListener( 'ready', function() {

	QUnit.module( 'Markdown' );

	test( 'Options are set', function() {
		strictEqual( marked.defaults.smartypants, true );
	});

	test( 'Smart quotes are activated', function() {
		var text = document.querySelector( '.reveal .slides>section>p' ).textContent;

		strictEqual( /['"]/.test( text ), false );
		strictEqual( /[“”‘’]/.test( text ), true );
	});

} );

Reveal.initialize({
	dependencies: [
		{ src: '../plugin/markdown/marked.js' },
		{ src: '../plugin/markdown/markdown.js' },
	],
	markdown: {
		smartypants: true
	}
});
