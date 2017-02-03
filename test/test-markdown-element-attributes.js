

Reveal.addEventListener( 'ready', function() {

	QUnit.module( 'Markdown' );

	test( 'Vertical separator', function() {
		strictEqual( document.querySelectorAll( '.reveal .slides>section>section' ).length, 4, 'found four slides' );
	});


	test( 'Attributes on element header in vertical slides', function() {
		strictEqual( document.querySelectorAll( '.reveal .slides section>section h2.fragment.fade-out' ).length, 1, 'found one vertical slide with class fragment.fade-out on header' );
		strictEqual( document.querySelectorAll( '.reveal .slides section>section h2.fragment.shrink' ).length, 1, 'found one vertical slide with class fragment.shrink on header' );
	});

	test( 'Attributes on element paragraphs in vertical slides', function() {
		strictEqual( document.querySelectorAll( '.reveal .slides section>section p.fragment.grow' ).length, 2, 'found a vertical slide with two paragraphs with class fragment.grow' );
	});

	test( 'Attributes on element list items in vertical slides', function() {
		strictEqual( document.querySelectorAll( '.reveal .slides section>section li.fragment.grow' ).length, 3, 'found a vertical slide with three list items with class fragment.grow' );
	});

	test( 'Attributes on element paragraphs in horizontal slides', function() {
		strictEqual( document.querySelectorAll( '.reveal .slides section p.fragment.highlight-red' ).length, 4, 'found a horizontal slide with four paragraphs with class fragment.grow' );
	});
	test( 'Attributes on element list items in horizontal slides', function() {
		strictEqual( document.querySelectorAll( '.reveal .slides section li.fragment.highlight-green' ).length, 5, 'found a horizontal slide with five list items with class fragment.roll-in' );
	});
	test( 'Attributes on element list items in horizontal slides', function() {
		strictEqual( document.querySelectorAll( '.reveal .slides section img.reveal.stretch' ).length, 1, 'found a horizontal slide with stretched image, class img.reveal.stretch' );
	});

	test( 'Attributes on elements in vertical slides with default element attribute separator', function() {
		strictEqual( document.querySelectorAll( '.reveal .slides section h2.fragment.highlight-red' ).length, 2, 'found two h2 titles with fragment highlight-red in vertical slides with default element attribute separator' );
	});

	test( 'Attributes on elements in single slides with default element attribute separator', function() {
		strictEqual( document.querySelectorAll( '.reveal .slides section p.fragment.highlight-blue' ).length, 3, 'found three elements with fragment highlight-blue in single slide with default element attribute separator' );
	});

} );

Reveal.initialize();

