

Reveal.addEventListener( 'ready', function() {

	QUnit.module( 'Markdown' );

	test( 'Vertical separator', function() {
		strictEqual( document.querySelectorAll( '.reveal .slides>section>section' ).length, 2, 'found two slides' );
	});

	test( 'Horizontal separator', function() {
		strictEqual( document.querySelectorAll( '.reveal .slides>section' ).length, 2, 'found two slides' );
	});

	test( 'Language highlighter', function() {
		strictEqual( document.querySelectorAll( '.hljs-keyword' ).length, 1, 'got rendered highlight tag.' );
		strictEqual( document.querySelector( '.hljs-keyword' ).innerHTML, 'var', 'the same keyword: var.' );
	});


} );

Reveal.initialize();

