

Reveal.addEventListener( 'ready', function() {

  QUnit.module( 'Markdown' );

  test( 'Vertical separator', function() {
    strictEqual( document.querySelectorAll( '.reveal .slides>section>section' ).length, 3, 'found three vertical slides' );
  });

  test( 'Id on slide', function() {
    strictEqual( document.querySelectorAll( '.reveal .slides>section>section#slide2' ).length, 1, 'found one slide with id slide2' );
    strictEqual( document.querySelectorAll( '.reveal .slides>section>section a[href="#/slide2"]' ).length, 1, 'found one slide with a link to slide2' );
  });

  test( 'data-background attributes', function() {
    strictEqual( document.querySelectorAll( '.reveal .slides>section>section[data-background="#A0C66B"]' ).length, 1, 'found one vertical slide with data-background="#A0C66B"' );
    strictEqual( document.querySelectorAll( '.reveal .slides>section>section[data-background="#ff0000"]' ).length, 1, 'found one vertical slide with data-background="#ff0000"' );
    strictEqual( document.querySelectorAll( '.reveal .slides>section[data-background="#C6916B"]' ).length, 1, 'found one slide with data-background="#C6916B"' );
  });

  test( 'data-transition attributes', function() {
    strictEqual( document.querySelectorAll( '.reveal .slides>section>section[data-transition="zoom"]' ).length, 1, 'found one vertical slide with data-transition="zoom"' );
    strictEqual( document.querySelectorAll( '.reveal .slides>section>section[data-transition="fade"]' ).length, 1, 'found one vertical slide with data-transition="fade"' );
    strictEqual( document.querySelectorAll( '.reveal .slides section [data-transition="zoom"]' ).length, 1, 'found one slide with data-transition="zoom"' );
  });

} );

Reveal.initialize();

