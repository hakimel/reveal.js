

Reveal.addEventListener( 'ready', function() {

	QUnit.module( 'API' );

	test( 'Reveal.isReady', function() {
		ok( Reveal.isReady() === true, 'returns true' );
	});

	test( 'Reveal.isOverview', function() {
		ok( Reveal.isOverview() === false, 'returns false' );

		Reveal.toggleOverview();
		ok( Reveal.isOverview() === true, 'returns true after toggling on' );

		Reveal.toggleOverview();
		ok( Reveal.isOverview() === false, 'returns false after toggling off' );
	});

	test( 'Reveal.isPaused', function() {
		ok( Reveal.isPaused() === false, 'returns false' );

		Reveal.togglePause();
		ok( Reveal.isPaused() === true, 'returns true after pausing' );

		Reveal.togglePause();
		ok( Reveal.isPaused() === false, 'returns false after resuming' );
	});

	test( 'Reveal.isFirstSlide', function() {
		Reveal.slide( 0 );
		ok( Reveal.isFirstSlide() === true, 'returns true after Reveal.slide( 0 )' );

		Reveal.slide( 1 );
		ok( Reveal.isFirstSlide() === false, 'returns false after Reveal.slide( 1 )' );

		Reveal.slide( 0 );
		ok( Reveal.isFirstSlide() === true, 'returns true after Reveal.slide( 0 )' );
	});

	test( 'Reveal.isLastSlide', function() {
		Reveal.slide( 0 );
		ok( Reveal.isLastSlide() === false, 'returns false after Reveal.slide( 0 )' );

		var lastSlideIndex = document.querySelectorAll( '.reveal .slides>section' ).length - 1;

		Reveal.slide( lastSlideIndex );
		ok( Reveal.isLastSlide() === true, 'returns true after Reveal.slide( '+ lastSlideIndex +' )' );

		Reveal.slide( 0 );
		ok( Reveal.isLastSlide() === false, 'returns false after Reveal.slide( 0 )' );
	});

	test( 'Reveal.getIndices', function() {
		var indices = Reveal.getIndices();

		ok( typeof indices.hasOwnProperty( 'h' ), 'h exists' );
		ok( typeof indices.hasOwnProperty( 'v' ), 'v exists' );
		ok( typeof indices.hasOwnProperty( 'f' ), 'f exists' );

		Reveal.slide( 1 );
		ok( Reveal.getIndices().h === 1 && Reveal.getIndices().v === 0, 'h 1, v 0' );

		Reveal.slide( 1, 2 );
		ok( Reveal.getIndices().h === 1 && Reveal.getIndices().v === 2, 'h 1, v 2' );

		Reveal.slide( 0 );
	});

	test( 'Reveal.getScale', function() {
		ok( typeof Reveal.getScale() === 'number', 'has scale' );
	});

	test( 'Reveal.getConfig', function() {
		ok( typeof Reveal.getConfig() === 'object', 'has config' );
	});


	QUnit.module( 'Events' );

	asyncTest( 'slidechanged', function() {
		expect( 1 );

		var _onSlideChanged = function( event ) {
			ok( true, 'event fired' );
			start();
		}

		Reveal.addEventListener( 'slidechanged', _onSlideChanged );

		// Should trigger the event
		Reveal.slide( 1 );

		// Should not trigger an event since it's the same #
		Reveal.slide( 1 );

		Reveal.removeEventListener( 'slidechanged', _onSlideChanged );

	});

} );

Reveal.initialize();

