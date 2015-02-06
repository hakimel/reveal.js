/* global Reveal, katex */

/**
 * A plugin that renders mathematical formulas inside reveal.js slides using
 * [KaTeX](https://github.com/Khan/KaTeX]).
 *
 * Calls `katex.renderToString` on DOM elements and regex matches and does some
 * error handling.
 *
 * @author Johannes Schmitz
 */
window.RevealMath = window.RevealMath || (function() {
	'use strict';

	// --- Options and defaults ------------------------------------------------

	var options = Reveal.getConfig().math || {};

	if ( options.ignoredElements ) {
		options.ignoredElements = options.ignoredElements
			.map(function ( x ) {
				return x.toUpperCase;
			});
	} else {
		options.ignoredElements = [ 'PRE', 'CODE' ];
	}

	if ( options.enableGlobally === undefined ) {
		options.enableGlobally = true;
	}

	if ( options.enableWorkarounds === undefined ) {
		options.enableWorkarounds = true;
	}


	// Hard-coded settings:

	var defaults = {
		formulaClass: 'formula',
		ignoredClass: 'math-ignored'    // May be set ont the element or direct
		                                // parent
	};

	// -------------------------------------------------------------------------


	function addStylesheet() {
		// - To fix a CSS issue: Prevent reveal.js from overriding the font of
		//   KaTeX elements.
		//
		// - To highlight errors (`.math-katex-error`)

		var stylesheet = document.createElement( 'style' );

		stylesheet.innerHTML  = '.reveal .katex { font-family: KaTeX_Main; }';
		stylesheet.innerHTML += '.reveal .math-katex-error { color: red }';

		stylesheet.innerHTML += '.reveal .katex.display { display: block }';

		stylesheet.innerHTML += '.reveal .katex.inline:not(first) {';
		stylesheet.innerHTML += '    margin-left: 0.35em;';
		stylesheet.innerHTML += '}';

		document.head.appendChild( stylesheet );
	}


	// --- Pre-processing ------------------------------------------------------

	// Workarounds for stuff that's not implemented yet in KaTeX v0.1.1
	//
	// Currently:
	//
	// - replace `\mid` to support it (conditional probabilities etc.)
	//
	// Other things that KaTeX can't handle which are not addressed here:
	//
	// - \overset
	//
	var preProcess = (function() {

		var regexMid = /\\mid/g;

		return function ( text ) {
			if ( options.enableWorkarounds === true ) {
				// `\mid` -> `\;|\;`
				return text.replace( regexMid, '\\;|\\;' );
			} else {
				return text;
			}
		};
	})();



	// --- TeX mode (dollars) --------------------------------------------------

	/**
	 * Replaces a formula within `$ … $` (inline) or `$$ … $$` (display).
	 */
	var replaceFormulaTex = (function() {

		var regexInline   = /([^\\])\$([^\$]*)\$/g;       // $ … $
		var regexDisplay  = /([^\\])\$\$([^\$]*)\$\$/g;   // $$ … $$

		// For workarounds:
		var regexCssClass = /<span class="katex">/;       // Used to add classes


		return function ( mode, text ) {
			var regex;

			if ( mode === 'inline'  ) {
				regex = regexInline;
			}
			else if ( mode === 'display' ) {
				regex = regexDisplay;
			}
			else {
				throw new Error( 'Invalid mode: ' + mode );
			}


			function replacer( _, lookbehind, group, offset ) {
				// (Depends on mode, thus nested.)

				if ( mode === 'display' ) {
					var prefix = '\\displaystyle {';
					offset += 2;    // $$
					offset -= prefix.length;

					group = prefix + group + '}';
				}
				else {
					offset++;    // $
				}

				var markup;

				try {
					markup = lookbehind + katex.renderToString( group );
				}
				catch ( error ) {
					correctErrorPosition( error, offset );  // mutates the error
					throw error;
				}


				// Add a class for the mode to the root element
				markup = markup.replace(
					regexCssClass,
					'<span class="katex ' + mode + '">'
				);

				return markup;
			}

			text = preProcess( text );
			return text.replace( regex, replacer );
		};

	})();


	/**
	 * Unescapes `\$` to `$` (for `tex` mode).
	 */
	var unescapeDollarSign = (function() {

		var regexUnescape = /\\\$/g;

		return function ( text ) {
			return text.replace( regexUnescape, '$' );
		};
	})();



	// --- Formula error handling ----------------------------------------------

	/**
	 * Change the `position` property of an error object thrown by KaTeX to get
	 * a more accurate error position. Mutates the passed object.
	 */
	function correctErrorPosition( error, offset ) {
		offset = offset || 0;
		error.position += offset;

		// Look for "… got '…' …" error message to adjust the position
		// (this will probably be broken by KaTeX updates).

		var matches = error.message.match( /got\s'(.*?)'/ );
		if ( matches !== null ) {
			// Text: "… got '…' …"
			error.position -= matches[1].length;
		}
	}


	/**
	 * Handles a KaTeX error by showing a more meaningful error message and
	 * highlighting the error on the slide.
	 *
	 * Wraps the error with a `span` with class `math-katex-error`. Notifies the
	 * user, but only for the first error.
	 */
	var handleError = (function() {

		var showedError = false;

		return function( error, formulaElement ) {

			var e = formulaElement;
			var slideNumber = getSlideNumber( e );

			// Wrap
			var s = e.innerHTML;
			e.innerHTML = s.slice( 0, error.position ) +
			              '<span class="math-katex-error">' +
			              s.slice( error.position ) +
			              "</span>";

			// Log
			console.error( 'Formula error on slide ' + slideNumber, error );

			// Just show a `window.alert`
			if ( !showedError ) {
				window.alert(
					'Formula on slide ' + slideNumber +
					' contains an error:\n\n' + error.message
				);

				showedError = true;
			}
		};
	})();


	/**
	 * Returns the slide number for a `section` DOM element.
	 */
	function getSlideNumber( slideElement ) {
		var presentation = document.querySelector( '.reveal .slides' );

		var slides = presentation.querySelectorAll( 'section' );

		for ( var i = 0; i < slides.length; i++ ) {
			if ( slides[i] === slideElement ) {
				return i;    // -1 here because the title slide is not counted.
			}
		}

		return null;
	}



	// --- Perform replacements ------------------------------------------------


	/**
	 * Replaces formulas in all slides: `$…$` / `$$…$$` or wrapped in elements
	 * with class `formula` or `math`.
	 */
	function replaceFormulas() {

		// Elements that wrap formulas explictly
		var wrappedElements = document.querySelectorAll( '.formula, .math' );

		// Slides that contain `$…$` or `$$…$$`
		var texSlideElements = document.querySelectorAll(
			options.enableGlobally === true ?
			'.reveal section' :
			'.reveal section[data-math]'
		);


		/**
		 * Tests if an element should be ignored for formula replacements.
		 */
		function isIgnored( element ) {

			var e = element;

			var isIgnoredElement =
				options.ignoredElements.indexOf( e.nodeName ) !== -1;

			// Elements may be marked as ignored with a class
			var isIgnoredClass =
				e.classList.contains( defaults.ignoredClass );

			// Also look for the ignored class on the parent (non-recursive)
			var parent = e.parentNode;
			if ( parent ) {
				isIgnoredClass = isIgnoredClass || parent.classList.contains(
					defaults.ignoredClass
				);
			}

			// Ignore script elements, unless they are templates (e.g. Markdown)
			var isTemplate = e.getAttribute( 'type' ) === 'text/template';
			var isScript = e.nodeName === 'SCRIPT' && !isTemplate;

			return isIgnoredElement || isIgnoredClass || isScript;
		}


		/**
		 * `forEach` for a set of DOM elements, excludes ignored elements.
		 */
		function each( arrayLike, f ) {
			for ( var i = 0; i < arrayLike.length; i++ ) {
				var element = arrayLike[i];

				if ( !isIgnored( element ) ) {
					f( element, i );
				}
			}
		}


		// Render <… class="formula"> … <…/> formulas

		each( wrappedElements, function ( e ) {

			var formula = e.innerHTML;
			var offset = 0;    // For error-position correction

			if (e.classList.contains( 'display' )) {
				// Prepend KaTeX instruction, correct offset

				var prefix = '\\displaystyle {';
				formula = prefix + formula + '}';
				offset -= prefix.length;
			}
			else {
				e.classList.add( 'inline' );     // ensure class
			}

			try {
				e.innerHTML = katex.renderToString( preProcess( formula ) );

				e.classList.add( 'formula' );    // In case it was selected
				                                 // with `.math`.

				// KaTeX adds a wrapper element, but we already have one, so
				// unwrap:
				e.classList.add( 'katex' );
				e.innerHTML = e.querySelector( '.katex' ).innerHTML;
			}
			catch ( error ) {
				correctErrorPosition( error, offset );  // mutates the error
				handleError( error, e );
			}
		});


		// Render `$…$` and `$$…$$` formulas
		// (must run after wrapped elements replacements to not replace twice)

		each( texSlideElements, function ( e ) {

			try {
				e.innerHTML = replaceFormulaTex( 'display', e.innerHTML );
				e.innerHTML = replaceFormulaTex( 'inline',  e.innerHTML );
				e.innerHTML = unescapeDollarSign( e.innerHTML );

				// Add a class to the created rendered elements (but keep class
				// `katex`, KaTeX needs this for its own CSS)

				var renderedFormulas = e.querySelectorAll( '.katex' );

				each( renderedFormulas, function ( forumula ) {
					forumula.classList.add( defaults.formulaClass );
				});
			}
			catch ( error ) {
				handleError( error, e );
			}
		});
	}




	// Run plugin

	addStylesheet();
	replaceFormulas();
	Reveal.layout();    // Update the slide layout

})();
