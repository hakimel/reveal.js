Reveal.addEventListener( 'ready', function() {

	QUnit.module( 'Markdown' );

	QUnit.test( 'Vertical separator', function( assert ) {
		assert.strictEqual( document.querySelectorAll( '.reveal .slides>section>section' ).length, 2, 'found two slides' );
	});

} );

Reveal.initialize();
