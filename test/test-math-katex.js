/* global QUnit, Reveal, test, strictEqual */

Reveal.addEventListener( 'ready', function() {

	QUnit.module( 'math-katex' );

	test( 'Formula replacements', function() {
		var formulas = document.querySelectorAll( '.formula' );
		strictEqual( formulas.length, 2, 'found two formulas' );

		function assertReplacements( elements ) {
			for (var i = 0; i < elements.length; i++) {
				strictEqual( elements[i].classList.contains('formula'), true, 'has class `formula`' );
				strictEqual( elements[i].innerText.indexOf('λ') !== -1, true, 'replaced `\\lamdba`' );
				strictEqual( elements[i].innerText.indexOf('∑') !== -1, true, 'replaced `\\sum`' );
			}
		}

		assertReplacements( formulas );
	});

	test( 'Literal dollar escaping', function() {
		strictEqual( document.querySelector( '.reveal .slides>section>p' ).innerText, 'This is an escaped dollar: $', 'escaped dollar' );
	});

} );

Reveal.initialize({

	math: {
		enableGlobally: false
	},

	dependencies: [
		{ src: '../plugin/math-katex/math-katex.js', async: true }
	]
});
