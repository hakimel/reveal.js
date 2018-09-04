Reveal.addEventListener( 'ready', function() {

	// Only one test for now, we're mainly ensuring that there
	// are no execution errors when running PDF mode

	QUnit.test( 'Reveal.isReady', function( assert ) {
		assert.strictEqual( Reveal.isReady(), true, 'returns true' );
	});

} );

Reveal.initialize({ pdf: true });
