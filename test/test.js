

Reveal.addEventListener( 'ready', function() {


	// ---------------------------------------------------------------
	// API TESTS

	QUnit.module( 'API' );

	test( 'Reveal.isReady', function() {
		strictEqual( Reveal.isReady(), true, 'returns true' );
	});

	test( 'Reveal.isOverview', function() {
		strictEqual( Reveal.isOverview(), false, 'false by default' );

		Reveal.toggleOverview();
		strictEqual( Reveal.isOverview(), true, 'true after toggling on' );

		Reveal.toggleOverview();
		strictEqual( Reveal.isOverview(), false, 'false after toggling off' );
	});

	test( 'Reveal.isPaused', function() {
		strictEqual( Reveal.isPaused(), false, 'false by default' );

		Reveal.togglePause();
		strictEqual( Reveal.isPaused(), true, 'true after pausing' );

		Reveal.togglePause();
		strictEqual( Reveal.isPaused(), false, 'false after resuming' );
	});

	test( 'Reveal.isFirstSlide', function() {
		Reveal.slide( 0 );
		strictEqual( Reveal.isFirstSlide(), true, 'true after Reveal.slide( 0 )' );

		Reveal.slide( 1 );
		strictEqual( Reveal.isFirstSlide(), false, 'false after Reveal.slide( 1 )' );

		Reveal.slide( 0 );
		strictEqual( Reveal.isFirstSlide(), true, 'true after Reveal.slide( 0 )' );
	});

	test( 'Reveal.isLastSlide', function() {
		Reveal.slide( 0 );
		strictEqual( Reveal.isLastSlide(), false, 'false after Reveal.slide( 0 )' );

		var lastSlideIndex = document.querySelectorAll( '.reveal .slides>section' ).length - 1;

		Reveal.slide( lastSlideIndex );
		strictEqual( Reveal.isLastSlide(), true, 'true after Reveal.slide( '+ lastSlideIndex +' )' );

		Reveal.slide( 0 );
		strictEqual( Reveal.isLastSlide(), false, 'false after Reveal.slide( 0 )' );
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

	test( 'Reveal.availableRoutes', function() {
		Reveal.slide( 0 );
		deepEqual( Reveal.availableRoutes(), { left: false, up: false, down: false, right: true }, 'correct for first slide' );
	});

	test( 'Reveal.configure', function() {
		strictEqual( Reveal.getConfig().loop, false, '"loop" is false to start with' );

		Reveal.configure({ loop: true });
		strictEqual( Reveal.getConfig().loop, true, '"loop" has changed to true' );

		Reveal.configure({ loop: false, customTestValue: 1 });
		strictEqual( Reveal.getConfig().customTestValue, 1, 'supports custom values' );
	});


	// ---------------------------------------------------------------
	// EVENT TESTS

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

