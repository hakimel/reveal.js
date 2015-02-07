/* global QUnit, Reveal, test, strictEqual */

Reveal.addEventListener( 'math-rendered', function () {

	QUnit.module( 'math-katex' );

	test( 'Formula replacements', function() {

		strictEqual( document.querySelectorAll( '.katex' ).length, 2, 'found two formulas' );

		var formulas = document.querySelectorAll( '.formula' );
		strictEqual( formulas.length, 2, 'found two formulas' );

		function assertReplacements( elements ) {
			for ( var i = 0; i < elements.length; i++ ) {
				strictEqual( elements[i].classList.contains( 'formula' ), true, 'has class `formula`' );
				strictEqual( elements[i].innerText.indexOf( 'λ' ) !== -1, true, 'replaced `\\lamdba`' );
				strictEqual( elements[i].innerText.indexOf( '∑' ) !== -1, true, 'replaced `\\sum`' );
			}
		}

		assertReplacements( formulas );

		var slides = document.querySelectorAll( 'section' );
		strictEqual( slides[0].innerHTML.indexOf( '$$' )  === -1, true, 'replaced all `$$` formulas' );
		strictEqual( slides[1].innerHTML.indexOf( '$$$' ) !== -1, true, 'did not change slide 2' );
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
