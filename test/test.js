
// These tests expect the DOM to contain a presentation
// with the following slide structure:
//
// 1
// 2 - Three sub-slides
// 3 - Three fragment elements
// 3 - Two fragments with same data-fragment-index
// 4


Reveal.addEventListener( 'ready', function() {

	// ---------------------------------------------------------------
	// DOM TESTS

	QUnit.module( 'DOM' );

	test( 'Initial slides classes', function() {
		var horizontalSlides = document.querySelectorAll( '.reveal .slides>section' )

		strictEqual( document.querySelectorAll( '.reveal .slides section.past' ).length, 0, 'no .past slides' );
		strictEqual( document.querySelectorAll( '.reveal .slides section.present' ).length, 1, 'one .present slide' );
		strictEqual( document.querySelectorAll( '.reveal .slides>section.future' ).length, horizontalSlides.length - 1, 'remaining horizontal slides are .future' );

		strictEqual( document.querySelectorAll( '.reveal .slides section.stack' ).length, 2, 'two .stacks' );

		ok( document.querySelectorAll( '.reveal .slides section.stack' )[0].querySelectorAll( '.future' ).length > 0, 'vertical slides are given .future' );
	});

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
		Reveal.slide( 0, 0 );
		strictEqual( Reveal.isFirstSlide(), true, 'true after Reveal.slide( 0, 0 )' );

		Reveal.slide( 1, 0 );
		strictEqual( Reveal.isFirstSlide(), false, 'false after Reveal.slide( 1, 0 )' );

		Reveal.slide( 0, 0 );
		strictEqual( Reveal.isFirstSlide(), true, 'true after Reveal.slide( 0, 0 )' );
	});

	test( 'Reveal.isLastSlide', function() {
		Reveal.slide( 0, 0 );
		strictEqual( Reveal.isLastSlide(), false, 'false after Reveal.slide( 0, 0 )' );

		var lastSlideIndex = document.querySelectorAll( '.reveal .slides>section' ).length - 1;

		Reveal.slide( lastSlideIndex, 0 );
		strictEqual( Reveal.isLastSlide(), true, 'true after Reveal.slide( ', 0+ lastSlideIndex +' )' );

		Reveal.slide( 0, 0 );
		strictEqual( Reveal.isLastSlide(), false, 'false after Reveal.slide( 0, 0 )' );
	});

	test( 'Reveal.getIndices', function() {
		var indices = Reveal.getIndices();

		ok( typeof indices.hasOwnProperty( 'h' ), 'h exists' );
		ok( typeof indices.hasOwnProperty( 'v' ), 'v exists' );
		ok( typeof indices.hasOwnProperty( 'f' ), 'f exists' );

		Reveal.slide( 1, 0 );
		ok( Reveal.getIndices().h === 1 && Reveal.getIndices().v === 0, 'h 1, v 0' );

		Reveal.slide( 1, 2 );
		ok( Reveal.getIndices().h === 1 && Reveal.getIndices().v === 2, 'h 1, v 2' );

		Reveal.slide( 0, 0 );
	});

	test( 'Reveal.getSlide', function() {
		var firstSlide = document.querySelector( '.reveal .slides>section:first-child' );

		equal( Reveal.getSlide( 0 ), firstSlide, 'gets correct first slide' );

		strictEqual( Reveal.getSlide( 100 ), undefined, 'returns undefined when slide can\'t be found' );
	});

	test( 'Reveal.getPreviousSlide/getCurrentSlide', function() {
		Reveal.slide( 0, 0 );
		Reveal.slide( 1, 0 );

		var firstSlide = document.querySelector( '.reveal .slides>section:first-child' );
		var secondSlide = document.querySelector( '.reveal .slides>section:nth-child(2)>section' );

		equal( Reveal.getPreviousSlide(), firstSlide, 'previous is slide #0' );
		equal( Reveal.getCurrentSlide(), secondSlide, 'current is slide #1' );
	});

	test( 'Reveal.getScale', function() {
		ok( typeof Reveal.getScale() === 'number', 'has scale' );
	});

	test( 'Reveal.getConfig', function() {
		ok( typeof Reveal.getConfig() === 'object', 'has config' );
	});

	test( 'Reveal.configure', function() {
		strictEqual( Reveal.getConfig().loop, false, '"loop" is false to start with' );

		Reveal.configure({ loop: true });
		strictEqual( Reveal.getConfig().loop, true, '"loop" has changed to true' );

		Reveal.configure({ loop: false, customTestValue: 1 });
		strictEqual( Reveal.getConfig().customTestValue, 1, 'supports custom values' );
	});

	test( 'Reveal.availableRoutes', function() {
		Reveal.slide( 0, 0 );
		deepEqual( Reveal.availableRoutes(), { left: false, up: false, down: false, right: true }, 'correct for first slide' );

		Reveal.slide( 1, 0 );
		deepEqual( Reveal.availableRoutes(), { left: true, up: false, down: true, right: true }, 'correct for vertical slide' );
	});

	test( 'Reveal.next', function() {
		Reveal.slide( 0, 0 );

		// Step through vertical child slides
		Reveal.next();
		deepEqual( Reveal.getIndices(), { h: 1, v: 0, f: undefined } );

		Reveal.next();
		deepEqual( Reveal.getIndices(), { h: 1, v: 1, f: undefined } );

		Reveal.next();
		deepEqual( Reveal.getIndices(), { h: 1, v: 2, f: undefined } );

		// Step through fragments
		Reveal.next();
		deepEqual( Reveal.getIndices(), { h: 2, v: 0, f: -1 } );

		Reveal.next();
		deepEqual( Reveal.getIndices(), { h: 2, v: 0, f: 0 } );

		Reveal.next();
		deepEqual( Reveal.getIndices(), { h: 2, v: 0, f: 1 } );

		Reveal.next();
		deepEqual( Reveal.getIndices(), { h: 2, v: 0, f: 2 } );
	});

	test( 'Reveal.next at end', function() {
		Reveal.slide( 3 );

		// We're at the end, this should have no effect
		Reveal.next();
		deepEqual( Reveal.getIndices(), { h: 3, v: 0, f: undefined } );

		Reveal.next();
		deepEqual( Reveal.getIndices(), { h: 3, v: 0, f: undefined } );
	});


	// ---------------------------------------------------------------
	// FRAGMENT TESTS

	QUnit.module( 'Fragments' );

	test( 'Sliding to fragments', function() {
		Reveal.slide( 2, 0, -1 );
		deepEqual( Reveal.getIndices(), { h: 2, v: 0, f: -1 }, 'Reveal.slide( 2, 0, -1 )' );

		Reveal.slide( 2, 0, 0 );
		deepEqual( Reveal.getIndices(), { h: 2, v: 0, f: 0 }, 'Reveal.slide( 2, 0, 0 )' );

		Reveal.slide( 2, 0, 2 );
		deepEqual( Reveal.getIndices(), { h: 2, v: 0, f: 2 }, 'Reveal.slide( 2, 0, 2 )' );

		Reveal.slide( 2, 0, 1 );
		deepEqual( Reveal.getIndices(), { h: 2, v: 0, f: 1 }, 'Reveal.slide( 2, 0, 1 )' );
	});

	test( 'Hiding all fragments', function() {
		var fragmentSlide = document.querySelector( '#fragment-slides>section:nth-child(1)' );

		Reveal.slide( 2, 0, 0 );
		strictEqual( fragmentSlide.querySelectorAll( '.fragment.visible' ).length, 1, 'one fragment visible when index is 0' );

		Reveal.slide( 2, 0, -1 );
		strictEqual( fragmentSlide.querySelectorAll( '.fragment.visible' ).length, 0, 'no fragments visible when index is -1' );
	});

	test( 'Current fragment', function() {
		var fragmentSlide = document.querySelector( '#fragment-slides>section:nth-child(1)' );

		Reveal.slide( 2, 0 );
		strictEqual( fragmentSlide.querySelectorAll( '.fragment.current-fragment' ).length, 0, 'no current fragment at index -1' );

		Reveal.slide( 2, 0, 0 );
		strictEqual( fragmentSlide.querySelectorAll( '.fragment.current-fragment' ).length, 1, 'one current fragment at index 0' );

		Reveal.slide( 1, 0, 0 );
		strictEqual( fragmentSlide.querySelectorAll( '.fragment.current-fragment' ).length, 0, 'no current fragment when navigating to previous slide' );

		Reveal.slide( 3, 0, 0 );
		strictEqual( fragmentSlide.querySelectorAll( '.fragment.current-fragment' ).length, 0, 'no current fragment when navigating to next slide' );
	});

	test( 'Stepping through fragments', function() {
		Reveal.slide( 2, 0, -1 );

		// forwards:

		Reveal.next();
		deepEqual( Reveal.getIndices(), { h: 2, v: 0, f: 0 }, 'next() goes to next fragment' );

		Reveal.right();
		deepEqual( Reveal.getIndices(), { h: 2, v: 0, f: 1 }, 'right() goes to next fragment' );

		Reveal.down();
		deepEqual( Reveal.getIndices(), { h: 2, v: 0, f: 2 }, 'down() goes to next fragment' );

		Reveal.down(); // moves to f #3

		// backwards:

		Reveal.prev();
		deepEqual( Reveal.getIndices(), { h: 2, v: 0, f: 2 }, 'prev() goes to prev fragment' );

		Reveal.left();
		deepEqual( Reveal.getIndices(), { h: 2, v: 0, f: 1 }, 'left() goes to prev fragment' );

		Reveal.up();
		deepEqual( Reveal.getIndices(), { h: 2, v: 0, f: 0 }, 'up() goes to prev fragment' );
	});

	test( 'Stepping past fragments', function() {
		var fragmentSlide = document.querySelector( '#fragment-slides>section:nth-child(1)' );

		Reveal.slide( 0, 0, 0 );
		equal( fragmentSlide.querySelectorAll( '.fragment.visible' ).length, 0, 'no fragments visible when on previous slide' );

		Reveal.slide( 3, 0, 0 );
		equal( fragmentSlide.querySelectorAll( '.fragment.visible' ).length, 3, 'all fragments visible when on future slide' );
	});

	test( 'Fragment indices', function() {
		var fragmentSlide = document.querySelector( '#fragment-slides>section:nth-child(2)' );

		Reveal.slide( 3, 0, 0 );
		equal( fragmentSlide.querySelectorAll( '.fragment.visible' ).length, 2, 'both fragments of same index are shown' );
	});

	test( 'Index generation', function() {
		var fragmentSlide = document.querySelector( '#fragment-slides>section:nth-child(1)' );

		// These have no indices defined to start with
		equal( fragmentSlide.querySelectorAll( '.fragment' )[0].getAttribute( 'data-fragment-index' ), '0' );
		equal( fragmentSlide.querySelectorAll( '.fragment' )[1].getAttribute( 'data-fragment-index' ), '1' );
		equal( fragmentSlide.querySelectorAll( '.fragment' )[2].getAttribute( 'data-fragment-index' ), '2' );
	});

	test( 'Index normalization', function() {
		var fragmentSlide = document.querySelector( '#fragment-slides>section:nth-child(3)' );

		// These start out as 1-4-4 and should normalize to 0-1-1
		equal( fragmentSlide.querySelectorAll( '.fragment' )[0].getAttribute( 'data-fragment-index' ), '0' );
		equal( fragmentSlide.querySelectorAll( '.fragment' )[1].getAttribute( 'data-fragment-index' ), '1' );
		equal( fragmentSlide.querySelectorAll( '.fragment' )[2].getAttribute( 'data-fragment-index' ), '1' );
	});

	asyncTest( 'fragmentshown event', function() {
		expect( 2 );

		var _onEvent = function( event ) {
			ok( true, 'event fired' );
		}

		Reveal.addEventListener( 'fragmentshown', _onEvent );

		Reveal.slide( 2, 0 );
		Reveal.slide( 2, 0 ); // should do nothing
		Reveal.slide( 2, 0, 0 ); // should do nothing
		Reveal.next();
		Reveal.next();
		Reveal.prev(); // shouldn't fire fragmentshown

		start();

		Reveal.removeEventListener( 'fragmentshown', _onEvent );
	});

	asyncTest( 'fragmenthidden event', function() {
		expect( 2 );

		var _onEvent = function( event ) {
			ok( true, 'event fired' );
		}

		Reveal.addEventListener( 'fragmenthidden', _onEvent );

		Reveal.slide( 2, 0, 2 );
		Reveal.slide( 2, 0, 2 ); // should do nothing
		Reveal.prev();
		Reveal.prev();
		Reveal.next(); // shouldn't fire fragmenthidden

		start();

		Reveal.removeEventListener( 'fragmenthidden', _onEvent );
	});


	// ---------------------------------------------------------------
	// CONFIGURATION VALUES

	QUnit.module( 'Configuration' );

	test( 'Controls', function() {
		var controlsElement = document.querySelector( '.reveal>.controls' );

		Reveal.configure({ controls: false });
		equal( controlsElement.style.display, 'none', 'controls are hidden' );

		Reveal.configure({ controls: true });
		equal( controlsElement.style.display, 'block', 'controls are visible' );
	});

	test( 'Progress', function() {
		var progressElement = document.querySelector( '.reveal>.progress' );

		Reveal.configure({ progress: false });
		equal( progressElement.style.display, 'none', 'progress are hidden' );

		Reveal.configure({ progress: true });
		equal( progressElement.style.display, 'block', 'progress are visible' );
	});

	test( 'Loop', function() {
		Reveal.configure({ loop: true });

		Reveal.slide( 0, 0 );

		Reveal.left();
		notEqual( Reveal.getIndices().h, 0, 'looped from start to end' );

		Reveal.right();
		equal( Reveal.getIndices().h, 0, 'looped from end to start' );

		Reveal.configure({ loop: false });
	});


	// ---------------------------------------------------------------
	// EVENT TESTS

	QUnit.module( 'Events' );

	asyncTest( 'slidechanged', function() {
		expect( 3 );

		var _onEvent = function( event ) {
			ok( true, 'event fired' );
		}

		Reveal.addEventListener( 'slidechanged', _onEvent );

		Reveal.slide( 1, 0 ); // should trigger
		Reveal.slide( 1, 0 ); // should do nothing
		Reveal.next(); // should trigger
		Reveal.slide( 3, 0 ); // should trigger
		Reveal.next(); // should do nothing

		start();

		Reveal.removeEventListener( 'slidechanged', _onEvent );

	});

	asyncTest( 'paused', function() {
		expect( 1 );

		var _onEvent = function( event ) {
			ok( true, 'event fired' );
		}

		Reveal.addEventListener( 'paused', _onEvent );

		Reveal.togglePause();
		Reveal.togglePause();

		start();

		Reveal.removeEventListener( 'paused', _onEvent );
	});

	asyncTest( 'resumed', function() {
		expect( 1 );

		var _onEvent = function( event ) {
			ok( true, 'event fired' );
		}

		Reveal.addEventListener( 'resumed', _onEvent );

		Reveal.togglePause();
		Reveal.togglePause();

		start();

		Reveal.removeEventListener( 'resumed', _onEvent );
	});


} );

Reveal.initialize();

