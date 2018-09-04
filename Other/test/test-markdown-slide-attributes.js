Reveal.addEventListener( 'ready', function() {

	QUnit.module( 'Markdown' );

	QUnit.test( 'Vertical separator', function( assert ) {
		assert.strictEqual( document.querySelectorAll( '.reveal .slides>section>section' ).length, 6, 'found six vertical slides' );
	});

	QUnit.test( 'Id on slide', function( assert ) {
		assert.strictEqual( document.querySelectorAll( '.reveal .slides>section>section#slide2' ).length, 1, 'found one slide with id slide2' );
		assert.strictEqual( document.querySelectorAll( '.reveal .slides>section>section a[href="#/slide2"]' ).length, 1, 'found one slide with a link to slide2' );
	});

	QUnit.test( 'data-background attributes', function( assert ) {
		assert.strictEqual( document.querySelectorAll( '.reveal .slides>section>section[data-background="#A0C66B"]' ).length, 1, 'found one vertical slide with data-background="#A0C66B"' );
		assert.strictEqual( document.querySelectorAll( '.reveal .slides>section>section[data-background="#ff0000"]' ).length, 1, 'found one vertical slide with data-background="#ff0000"' );
		assert.strictEqual( document.querySelectorAll( '.reveal .slides>section[data-background="#C6916B"]' ).length, 1, 'found one slide with data-background="#C6916B"' );
	});

	QUnit.test( 'data-transition attributes', function( assert ) {
		assert.strictEqual( document.querySelectorAll( '.reveal .slides>section>section[data-transition="zoom"]' ).length, 1, 'found one vertical slide with data-transition="zoom"' );
		assert.strictEqual( document.querySelectorAll( '.reveal .slides>section>section[data-transition="fade"]' ).length, 1, 'found one vertical slide with data-transition="fade"' );
		assert.strictEqual( document.querySelectorAll( '.reveal .slides section [data-transition="zoom"]' ).length, 1, 'found one slide with data-transition="zoom"' );
	});

	QUnit.test( 'data-background attributes with default separator', function( assert ) {
		assert.strictEqual( document.querySelectorAll( '.reveal .slides>section>section[data-background="#A7C66B"]' ).length, 1, 'found one vertical slide with data-background="#A0C66B"' );
		assert.strictEqual( document.querySelectorAll( '.reveal .slides>section>section[data-background="#f70000"]' ).length, 1, 'found one vertical slide with data-background="#ff0000"' );
		assert.strictEqual( document.querySelectorAll( '.reveal .slides>section[data-background="#C7916B"]' ).length, 1, 'found one slide with data-background="#C6916B"' );
	});

	QUnit.test( 'data-transition attributes with default separator', function( assert ) {
		assert.strictEqual( document.querySelectorAll( '.reveal .slides>section>section[data-transition="concave"]' ).length, 1, 'found one vertical slide with data-transition="zoom"' );
		assert.strictEqual( document.querySelectorAll( '.reveal .slides>section>section[data-transition="page"]' ).length, 1, 'found one vertical slide with data-transition="fade"' );
		assert.strictEqual( document.querySelectorAll( '.reveal .slides section [data-transition="concave"]' ).length, 1, 'found one slide with data-transition="zoom"' );
	});

	QUnit.test( 'data-transition attributes with inline content', function( assert ) {
		assert.strictEqual( document.querySelectorAll( '.reveal .slides>section[data-background="#ff0000"]' ).length, 3, 'found three horizontal slides with data-background="#ff0000"' );
	});

} );

Reveal.initialize();
