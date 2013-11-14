
Reveal.addEventListener( 'ready', function() {


	// ---------------------------------------------------------------
	// API TESTS

	QUnit.module( 'API' );

    test( 'current-fragment when doing simple moves', function() {
      var fragmentContainer = document.querySelector( '#fragment-container' );
      equal( fragmentContainer.querySelectorAll( '.fragment.current-fragment' ).length, 0, 'initially there are no current fragment' );

      //Stepping forward
      Reveal.next();
      equal( fragmentContainer.querySelectorAll( '.fragment.current-fragment' ).length, 1, 'next() activated first fragment' );
      equal( fragmentContainer.querySelectorAll( '.fragment.current-fragment' )[0].innerHTML, 'item0', 'next() activated first fragment' );

      Reveal.next();
      equal( fragmentContainer.querySelectorAll( '.fragment.current-fragment' ).length, 1, 'next() activated second fragment'  );
      equal( fragmentContainer.querySelectorAll( '.fragment.current-fragment' )[0].innerHTML, 'item1', 'next() activated second fragment'  );

      //Stepping backward
      Reveal.prev();
      equal( fragmentContainer.querySelectorAll( '.fragment.current-fragment' ).length, 1, 'prev() activated first fragment' );
      equal( fragmentContainer.querySelectorAll( '.fragment.current-fragment' )[0].innerHTML, 'item0', 'prev() activated first fragment'  );

      Reveal.prev();
      equal( fragmentContainer.querySelectorAll( '.fragment.current-fragment' ).length, 0, 'prev() deactivated every fragment' );
    });

    test( 'current-fragment when changing slide', function() {
      var fragmentContainer = document.querySelector( '#fragment-container' );
        Reveal.next(); //display the 1st fragment
        Reveal.next(); //display the 2nd fragment
        Reveal.next(); //changing slide

      equal( fragmentContainer.querySelectorAll( '.fragment.current-fragment' ).length, 0, 'no current fragment since we just arrived on the next slide' );

      Reveal.prev(); //get back to the previous slide
      equal( fragmentContainer.querySelectorAll( '.fragment.current-fragment' ).length, 1, 'getting back on a slide activate the last fragments'  );
      equal( fragmentContainer.querySelectorAll( '.fragment.current-fragment' )[0].innerHTML, 'item1', 'getting back on a slide activate the last fragments'  );
    });

} );

Reveal.initialize();
