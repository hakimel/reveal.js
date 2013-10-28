

Reveal.addEventListener( 'ready', function() {

	QUnit.module( 'Markdown' );

	test( 'Vertical separator', function() {
		strictEqual( document.querySelectorAll( '.reveal .slides>section>section' ).length, 2, 'found two slides' );
	});


	test( 'Attributes on vertical slides header', function() {
		strictEqual( document.querySelectorAll( '.reveal .slides section>section h2.fragment.fade-out' ).length, 1, 'found one vertical slide with class fragment.fade-out on header' );
		strictEqual( document.querySelectorAll( '.reveal .slides section>section h2.fragment.shrink' ).length, 1, 'found one vertical slide with class fragment.shrink on header' );
	});

	test( 'Attributes on vertical slides paragraphs', function() {
		strictEqual( document.querySelectorAll( '.reveal .slides section>section p.fragment.grow' ).length, 2, 'found a vertical slide with two paragraphs with class fragment.grow' );
	});

	test( 'Attributes on vertical slides list items', function() {
		strictEqual( document.querySelectorAll( '.reveal .slides section>section li.fragment.roll-in' ).length, 3, 'found a vertical slide with three list items with class fragment.roll-in' );
	});

	test( 'Attributes on horizontal slides paragraphs', function() {
		strictEqual( document.querySelectorAll( '.reveal .slides section p.fragment.highlight-red' ).length, 4, 'found a horizontal slide with four paragraphs with class fragment.grow' );
	});
	test( 'Attributes on horizontal slides list items', function() {
		strictEqual( document.querySelectorAll( '.reveal .slides section li.fragment.highlight-green' ).length, 5, 'found a horizontal slide with five list items with class fragment.roll-in' );
	});
	test( 'Attributes on horizontal slides list items', function() {
		strictEqual( document.querySelectorAll( '.reveal .slides section img.reveal.stretch' ).length, 1, 'found a horizontal slide with stretched image, class img.reveal.stretch' );
	});

} );

Reveal.initialize();

