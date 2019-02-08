Reveal.addEventListener( 'ready', function() {

	QUnit.module( 'Markdown' );

	QUnit.test( 'Vertical separator', function( assert ) {
		assert.strictEqual( document.querySelectorAll( '.reveal .slides>section>section' ).length, 2, 'found two slides' );
	});

	QUnit.test( 'Horizontal separator', function( assert ) {
		assert.strictEqual( document.querySelectorAll( '.reveal .slides>section' ).length, 2, 'found two slides' );
	});

	QUnit.test( 'Language highlighter', function( assert ) {
		assert.strictEqual( document.querySelectorAll( '.hljs-keyword' ).length, 1, 'got rendered highlight tag.' );
		assert.strictEqual( document.querySelector( '.hljs-keyword' ).innerHTML, 'var', 'the same keyword: var.' );
	});

} );

Reveal.initialize();
