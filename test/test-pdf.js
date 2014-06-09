
Reveal.addEventListener( 'ready', function() {

	// Only one test for now, we're mainly ensuring that there
	// are no execution errors when running PDF mode

	test( 'Reveal.isReady', function() {
		strictEqual( Reveal.isReady(), true, 'returns true' );
	});


} );

Reveal.initialize({ pdf: true });

